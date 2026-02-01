import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

export interface TransactionVerification {
  isValid: boolean;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  confirmations: number;
  timestamp?: number;
}

export interface WalletBalance {
  address: string;
  bnbBalance: string;
  tokenBalance?: string;
  tokenSymbol?: string;
}

export interface CryptoPrices {
  aster: number;
  bnb: number;
  lastUpdated: Date;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private readonly bscRpcUrl: string;
  private readonly asterTokenAddress: string;

  // ERC20 ABI for balance checking
  private readonly erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
  ];

  // Cache for prices (5 minute TTL)
  private priceCache: { prices: CryptoPrices; expiry: number } | null = null;
  private readonly PRICE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private configService: ConfigService) {
    this.bscRpcUrl = this.configService.get<string>('BSC_RPC_URL') || 'https://bsc-dataseed.binance.org/';
    this.asterTokenAddress = this.configService.get<string>('ASTER_TOKEN_ADDRESS') || '';

    this.provider = new ethers.JsonRpcProvider(this.bscRpcUrl);
    this.logger.log(`Blockchain service initialized with RPC: ${this.bscRpcUrl}`);
  }

  /**
   * Verify a wallet signature to prove ownership
   */
  async verifySignature(message: string, signature: string, expectedAddress: string): Promise<boolean> {
    try {
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Compare addresses (case-insensitive)
      const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();

      this.logger.log(`Signature verification for ${expectedAddress}: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error(`Signature verification failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get wallet balance for BNB and optionally a specific token
   */
  async getWalletBalance(address: string, tokenAddress?: string): Promise<WalletBalance> {
    try {
      // Validate address
      if (!ethers.isAddress(address)) {
        throw new BadRequestException('Invalid wallet address');
      }

      // Get BNB balance
      const bnbBalanceWei = await this.provider.getBalance(address);
      const bnbBalance = ethers.formatEther(bnbBalanceWei);

      const result: WalletBalance = {
        address,
        bnbBalance,
      };

      // Get token balance if address provided
      const tokenToCheck = tokenAddress || this.asterTokenAddress;
      if (tokenToCheck && ethers.isAddress(tokenToCheck)) {
        try {
          const tokenContract = new ethers.Contract(tokenToCheck, this.erc20Abi, this.provider);
          const [balance, decimals, symbol] = await Promise.all([
            tokenContract.balanceOf(address),
            tokenContract.decimals(),
            tokenContract.symbol(),
          ]);

          result.tokenBalance = ethers.formatUnits(balance, decimals);
          result.tokenSymbol = symbol;
        } catch (tokenError) {
          this.logger.warn(`Failed to fetch token balance: ${tokenError.message}`);
        }
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to get wallet balance: ${error.message}`);
      throw new BadRequestException(`Failed to get wallet balance: ${error.message}`);
    }
  }

  /**
   * Verify a BSC transaction
   */
  async verifyTransaction(txHash: string): Promise<TransactionVerification> {
    try {
      // Validate transaction hash format
      if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
        throw new BadRequestException('Invalid transaction hash format');
      }

      // Get transaction and receipt
      const [tx, receipt] = await Promise.all([
        this.provider.getTransaction(txHash),
        this.provider.getTransactionReceipt(txHash),
      ]);

      if (!tx) {
        throw new BadRequestException('Transaction not found');
      }

      // Get current block number for confirmations
      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = tx.blockNumber ? currentBlock - tx.blockNumber : 0;

      // Get block timestamp if available
      let timestamp: number | undefined;
      if (tx.blockNumber) {
        const block = await this.provider.getBlock(tx.blockNumber);
        timestamp = block?.timestamp;
      }

      return {
        isValid: receipt?.status === 1,
        from: tx.from,
        to: tx.to || '',
        value: ethers.formatEther(tx.value),
        blockNumber: tx.blockNumber || 0,
        confirmations,
        timestamp,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Transaction verification failed: ${error.message}`);
      throw new BadRequestException(`Transaction verification failed: ${error.message}`);
    }
  }

  /**
   * Get ASTER token price (mock implementation - integrate with CoinGecko/CMC for production)
   */
  async getAsterPrice(): Promise<number> {
    const prices = await this.getCryptoPrices();
    return prices.aster;
  }

  /**
   * Get BNB price (mock implementation - integrate with CoinGecko/CMC for production)
   */
  async getBnbPrice(): Promise<number> {
    const prices = await this.getCryptoPrices();
    return prices.bnb;
  }

  /**
   * Get all crypto prices with caching
   */
  async getCryptoPrices(): Promise<CryptoPrices> {
    // Check cache
    if (this.priceCache && Date.now() < this.priceCache.expiry) {
      return this.priceCache.prices;
    }

    // In production, integrate with CoinGecko or CoinMarketCap API
    // For now, return mock prices with some randomness to simulate real data
    const coingeckoApiKey = this.configService.get<string>('COINGECKO_API_KEY');

    let prices: CryptoPrices;

    if (coingeckoApiKey) {
      // Attempt to fetch real prices
      try {
        prices = await this.fetchRealPrices(coingeckoApiKey);
      } catch (error) {
        this.logger.warn(`Failed to fetch real prices, using mock: ${error.message}`);
        prices = this.getMockPrices();
      }
    } else {
      prices = this.getMockPrices();
    }

    // Cache the prices
    this.priceCache = {
      prices,
      expiry: Date.now() + this.PRICE_CACHE_TTL,
    };

    return prices;
  }

  /**
   * Fetch real prices from CoinGecko (placeholder for production)
   */
  private async fetchRealPrices(apiKey: string): Promise<CryptoPrices> {
    // In production, implement actual CoinGecko API call
    // For now, return mock prices
    this.logger.log('CoinGecko API key provided, but using mock prices for development');
    return this.getMockPrices();
  }

  /**
   * Get mock prices for development/testing
   */
  private getMockPrices(): CryptoPrices {
    // Base prices with slight random variation
    const baseAster = 0.05;
    const baseBnb = 580;

    const asterVariation = (Math.random() - 0.5) * 0.01; // +/- 0.005
    const bnbVariation = (Math.random() - 0.5) * 20; // +/- 10

    return {
      aster: Number((baseAster + asterVariation).toFixed(4)),
      bnb: Number((baseBnb + bnbVariation).toFixed(2)),
      lastUpdated: new Date(),
    };
  }

  /**
   * Verify that a transaction is a valid premium payment
   * Used by PremiumService to validate payment transactions
   */
  async verifyPremiumPayment(
    txHash: string,
    expectedRecipient: string,
    minAmount: string,
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const verification = await this.verifyTransaction(txHash);

      // Check if transaction was successful
      if (!verification.isValid) {
        return { isValid: false, error: 'Transaction failed on-chain' };
      }

      // Check recipient
      if (verification.to.toLowerCase() !== expectedRecipient.toLowerCase()) {
        return { isValid: false, error: 'Transaction recipient mismatch' };
      }

      // Check amount
      const sentAmount = parseFloat(verification.value);
      const required = parseFloat(minAmount);
      if (sentAmount < required) {
        return { isValid: false, error: `Insufficient payment: sent ${sentAmount}, required ${required}` };
      }

      // Check confirmations (require at least 3 for BSC)
      if (verification.confirmations < 3) {
        return { isValid: false, error: `Insufficient confirmations: ${verification.confirmations}/3` };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
}
