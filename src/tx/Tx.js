import { Tx as BabbageTx, TxInput } from "@helios-lang/ledger-babbage"
import { NetworkParamsHelper } from "../params/index.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/uplc").UplcData} UplcData
 * @typedef {import("../params/index.js").NetworkParams} NetworkParams
 */

export class Tx extends BabbageTx {
    /**
     * Deserialize a CBOR encoded Cardano transaction (input is either an array of bytes, or a hex string).
     * @param {BytesLike} bytes
     * @returns {Tx}
     */
    static fromCbor(bytes) {
        const btx = BabbageTx.fromCbor(bytes)

        return new Tx(btx.body, btx.witnesses, btx.isValid(), btx.metadata)
    }

    /**
     * @override
     * @param {NetworkParams} params
     * @returns {bigint} - a quantity of lovelace
     */
    calcMinFee(params) {
        const helper = new NetworkParamsHelper(params)

        const [a, b] = helper.txFeeParams

        const sizeFee = BigInt(a) + BigInt(this.calcSize(true)) * BigInt(b)

        const exFee = this.witnesses.calcExFee(params)

        const refScriptSize = calcRefScriptsSize(
            this.body.inputs,
            this.body.refInputs
        )
        const refScriptsFee =
            BigInt(helper.refScriptsFeePerByte) * BigInt(refScriptSize)

        return sizeFee + exFee + refScriptsFee
    }
}

/**
 * @param {TxInput[]} inputs
 * @param {Option<TxInput[]>} refInputs
 * @returns {bigint} - number of cbor bytes
 */
export function calcRefScriptsSize(inputs, refInputs) {
    const refScriptSize = inputs
        .concat(refInputs ?? [])
        .reduce((prev, txInput) => {
            if (txInput.output.refScript) {
                return prev + BigInt(txInput.output.refScript.toCbor().length)
            } else {
                return prev
            }
        }, 0n)

    return refScriptSize
}
