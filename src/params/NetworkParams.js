import {
    DEFAULT_COST_MODEL_PARAMS_V1,
    DEFAULT_COST_MODEL_PARAMS_V2,
    DEFAULT_COST_MODEL_PARAMS_V3
} from "@helios-lang/uplc"

/**
 * @typedef {import("@helios-lang/ledger-babbage").NetworkParams} BabbageNetworkParams
 */

/**
 * @typedef {BabbageNetworkParams & {
 *   costModelParamsV3: number[]
 *   refScriptFeePerByte: number
 * }} NetworkParams
 */

/**
 * @returns {NetworkParams}
 */
export function DEFAULT_NETWORK_PARAMS() {
    return {
        collateralPercentage: 150,
        costModelParamsV1: DEFAULT_COST_MODEL_PARAMS_V1(),
        costModelParamsV2: DEFAULT_COST_MODEL_PARAMS_V2(),
        costModelParamsV3: DEFAULT_COST_MODEL_PARAMS_V3(),
        exMemFeePerUnit: 5.77e-2,
        exCpuFeePerUnit: 7.21e-5,
        maxCollateralInputs: 3,
        maxTxExCpu: 10000000000,
        maxTxExMem: 14000000,
        maxTxSize: 16384,
        refScriptFeePerByte: 15,
        refTipSlot: 113163674,
        refTipTime: 1704729965000,
        secondsPerSlot: 1,
        stakeAddrDeposit: 2000000,
        txFeeFixed: 155381,
        txFeePerByte: 44,
        utxoDepositPerByte: 4310
    }
}
