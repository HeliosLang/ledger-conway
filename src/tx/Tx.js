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

        const refScriptsSize = calcRefScriptsSize(
            this.body.inputs,
            this.body.refInputs
        )
        const refScriptsFee = calcRefScriptsFee(
            refScriptsSize,
            helper.refScriptsFeePerByte
        )

        return sizeFee + exFee + refScriptsFee
    }
}

/**
 * @param {bigint} size
 * @param {number} feePerByte
 * @param {bigint} growthIncrement
 * @param {number} growthFactor
 * @returns {bigint} - a lovelace value
 */
export function calcRefScriptsFee(
    size,
    feePerByte,
    growthIncrement = 25600n,
    growthFactor = 1.2
) {
    let multiplier = 1.0
    let fee = 0n

    while (size > growthIncrement) {
        fee += BigInt(
            Math.floor(Number(growthIncrement) * multiplier * feePerByte)
        )
        size -= growthIncrement
        multiplier *= growthFactor
    }

    fee += BigInt(Math.floor(Number(size) * multiplier * feePerByte))

    return fee
}

/**
 * Calculates the total size of reference scripts in unique inputs
 * @param {TxInput[]} inputs
 * @param {Option<TxInput[]>} refInputs
 * @returns {bigint} - number of cbor bytes
 */
export function calcRefScriptsSize(inputs, refInputs) {
    /**
     * @type {Record<string, TxInput>}
     */
    const uniqueInputs = {}

    inputs.concat(refInputs ?? []).forEach((input) => {
        uniqueInputs[input.id.toString()] = input
    })

    const refScriptSize = Object.values(uniqueInputs).reduce(
        (prev, txInput) => {
            if (txInput.output.refScript) {
                return prev + BigInt(txInput.output.refScript.toCbor().length)
            } else {
                return prev
            }
        },
        0n
    )

    return refScriptSize
}
