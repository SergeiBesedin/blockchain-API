import * as crypto from 'crypto';
import { IBlock } from './typing/typing';

//реализация через функции

//блокчейн с доказательством проделанной работы
function block(
  index: number,
  previousBlockHash: string,
  timestamp: number,
  data: string
): IBlock {
  const calculateHash = (nonce: number): string => {
    const str = index + previousBlockHash + timestamp + data + nonce;
    return crypto.createHash('sha256').update(str).digest('hex');
  };

  const mine = (): { nonce: number; hash: string } => {
    let hash: string;
    let nonce = 0;

    do {
      hash = calculateHash(++nonce);
    } while (hash.startsWith('00000') === false);

    return { nonce, hash };
  };

  return {
    index,
    previousBlockHash,
    timestamp,
    data,
    hash: mine().hash,
    nonce: mine().nonce,
  };
}

function blockchain() {
  const chain: IBlock[] = [];
  chain.push(block(0, '', Date.now(), 'Genesis block')); //первичный блок

  return {
    get latestBlock() {
      //получаем последний блок
      return chain[chain.length - 1];
    },
    addBlock(data: string) {
      chain.push(
        block(
          this.latestBlock.index + 1,
          this.latestBlock.hash,
          Date.now(),
          data
        )
      );
      console.log(chain[chain.length - 1]);
    },
    getBlockchain() {
      return chain;
    },
  };
}

const miner = (amount: number): void => {
  const bc = blockchain(); //создаем первичный блок
  console.log(bc.latestBlock);

  for (let i = 1; i <= amount; i++) {
    bc.addBlock(`${i} block`); //добавляем блок
  }
};

miner(10); //запуск
