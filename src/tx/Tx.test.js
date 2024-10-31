import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { calcRefScriptsFee } from "./Tx.js"

describe("calcRefScriptsFee", () => {
    it("constant fee per byte for growth factor equal to 1", () => {
        const size = 18754781231n
        const fee = calcRefScriptsFee(size, 15, 25600n, 1)
        strictEqual(fee, 15n * size)
    })

    it("equals 0 for [size=0, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(0n, 15, 25600n, 1.5), 0n)
    })

    it("equals 384000 for [size=25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(25600n, 15, 25600n, 1.5), 384000n)
    })

    it("equals 960000 for [size=2*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(2n * 25600n, 15, 25600n, 1.5), 960000n)
    })

    it("equals 1824000 for [size=3*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(3n * 25600n, 15, 25600n, 1.5), 1824000n)
    })

    it("equals 3120000 for [size=4*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(4n * 25600n, 15, 25600n, 1.5), 3120000n)
    })

    it("equals 5064000 for [size=5*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(5n * 25600n, 15, 25600n, 1.5), 5064000n)
    })

    it("equals 7980000 for [size=6*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(6n * 25600n, 15, 25600n, 1.5), 7980000n)
    })

    it("equals 12354000 for [size=7*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(7n * 25600n, 15, 25600n, 1.5), 12354000n)
    })

    it("equals 18915000 for [size=8*25600, feePerByte=15, growthIncrement=25600, growthFactor=1.5]", () => {
        strictEqual(calcRefScriptsFee(8n * 25600n, 15, 25600n, 1.5), 18915000n)
    })
})
