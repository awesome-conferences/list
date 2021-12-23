import { randomColor } from "../randomColor.js"
describe("words coloriser", () => {
    it("converts a single letter A", () => {
        const result = randomColor("A");
        expect(result).toBe("hsl(14,0%,50%)");
    });
    it("converts a single letter Z", () => {
        const result = randomColor("Z");
        expect(result).toBe("hsl(26,100%,50%)");
    });
    it("converts a long word", () => {
        const result = randomColor("ABCDEFGHIJK");
        expect(result).toBe("hsl(79,76.55502392344499%,50%)");
    });
    it("produces different results for diffent inputs", () => {
        const result1 = randomColor("A");
        const result2 = randomColor("B");
        expect(result1).not.toBe(result2);
    });
})
