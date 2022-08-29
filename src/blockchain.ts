import * as crypto from 'crypto';
import { IBlock } from './typing/typing';

//реализация через классы

//блокчейн без доказательств проделанной работы
class SimpleBlock implements IBlock {
  readonly hash: string;

  constructor(
    readonly index: number,
    readonly previousBlockHash: string,
    readonly timestamp: number,
    readonly data: string
  ) {
    this.hash = this.calculateHash();
  }

  protected calculateHash(nonce: number | string = ''): string {
    const data =
      this.index + this.previousBlockHash + this.timestamp + this.data + nonce;

    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

//блокчейн с доказательством проделанной работы
class Block extends SimpleBlock {
  readonly nonce: number;
  readonly hash: string;

  constructor(
    index: number,
    previousBlockHash: string,
    timestamp: number,
    data: string
  ) {
    super(index, previousBlockHash, timestamp, data);
    const { nonce, hash } = this.mine();
    this.nonce = nonce;
    this.hash = hash;
  }

  private mine(): { nonce: number; hash: string } {
    let hash: string;
    let nonce = 0;

    do {
      hash = super.calculateHash(++nonce);
    } while (hash.startsWith('00000') === false);

    return { nonce, hash };
  }
}

class Blockchain {
  private readonly chain: SimpleBlock[];

  constructor(private isCalculate: boolean) {
    this.chain = [];
    this.createBlock(0, '', Date.now(), 'Genesis block'); //первичный блок
  }

  private createBlock(
    ind: number,
    previousBlockHash: string,
    timestamp: number,
    data: string
  ): void {
    const block = this.isCalculate
      ? new Block(ind, previousBlockHash, timestamp, data)
      : new SimpleBlock(ind, previousBlockHash, timestamp, data);
    this.chain.push(block);
  }

  private get latestBlock(): SimpleBlock {
    //получаем последний блок
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: string): void {
    this.createBlock(
      this.latestBlock.index + 1,
      this.latestBlock.hash,
      Date.now(),
      data
    );
    console.log(this.chain[this.chain.length - 1]);
  }
}

const miner = (isCalculate: boolean, amount: number): void => {
  const blockchain = new Blockchain(isCalculate); //создаем первичный блок

  for (let i = 1; i <= amount; i++) {
    blockchain.addBlock(`${i} block`); //добавляем блок
  }
};

miner(true, 10); //запуск
