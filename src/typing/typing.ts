export interface IBlock {
  index: number; //id блока
  timestamp: number; //поисковый критерий
  data: string; //данные об одной или нескольких транзакциях
  hash: string; //хэш этого блока
  previousBlockHash: string; //хэш предыдущего блока
  nonce?: number; //число, которое необходимо вычислить
}
