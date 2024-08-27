import { toInt } from "@helios-lang/codec-utils"
import { NetworkParamsHelper as BabbageNetworkParamsHelper } from "@helios-lang/ledger-babbage"
import { None, expectSome } from "@helios-lang/type-utils"
import { DEFAULT_NETWORK_PARAMS } from "./NetworkParams.js"

/**
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("./NetworkParams.js").NetworkParams} NetworkParams
 */

/**
 * Wrapper for the raw JSON containing all the current network parameters.
 *
 * NetworkParamsHelper is needed to be able to calculate script budgets and perform transaction building checks.
 * @extends {BabbageNetworkParamsHelper<NetworkParams>}
 */
export class NetworkParamsHelper extends BabbageNetworkParamsHelper {
    /**
     * @returns {NetworkParamsHelper}
     */
    static default() {
        return new NetworkParamsHelper(DEFAULT_NETWORK_PARAMS())
    }

    /**
     * Needed when calculating the scriptDataHash inside the TxBuilder
     * @type {number[]}
     */
    get costParamsV3() {
        return expectSome(
            this.params?.costModelParamsV3,
            "'networkParams.costModelParamsV3' undefined"
        )
    }

    /**
     * @type {number}
     */
    get refScriptsFeePerByte() {
        const f = expectSome(
            this.params?.refScriptFeePerByte,
            "'networkParams.refScriptFeePerByte' undefined"
        )

        return f
    }
}
