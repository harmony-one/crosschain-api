import { ChainId, Token, TokenAmount, Pair, Route } from '@uniswap/sdk'

export const exactInputTrade = async (chainId,tokenA,tokenB,decimalsA,decimalsB,symbolA,symbolB,nameA,nameB,tokenAmountA,tokenAmountB,tradeType) => {
    return trade(chainId,tokenA,tokenB,decimalsA,decimalsB,symbolA,symbolB,nameA,nameB,tokenAmountA,tokenAmountB,TradeType.EXACT_INPUT) 
}

const trade = async (chainId,tokenA,tokenB,decimalsA,decimalsB,symbolA,symbolB,nameA,nameB,tokenAmountA,tokenAmountB,tradeType) => {
    const TokenA = new Token(chainId, tokenA, decimalsA, symbolA, nameA)
    const TokenB = new Token(chainId, tokenB, decimalsB, symbolB, nameB)
    const A_B = new Pair(new TokenAmount(TokenA, tokenAmountA), new TokenAmount(TokenB, tokenAmountB))
    const A_TO_B = new Route([A_B], TokenB)
    const trade = new Trade(A_TO_B, new TokenAmount(TokenB, tokenAmountB), tradeType)
    return trade
}

