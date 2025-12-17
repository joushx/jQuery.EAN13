import { describe, it, expect } from 'vitest';

// Load the built artifact
// Using require because it's a UMD/Global script that exports via module.exports if detected
const EAN13 = require('../dist/ean13.js');


describe('EAN13 Class', () => {

    // Helper to create a canvas
    const createCanvas = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 950;
        canvas.height = 600;
        return canvas;
    };

    it('onError called when number is null', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), null, {
                onError: (desc: any) => {
                    expect(desc).toBe("Number cannot be null");
                    resolve();
                },
                onSuccess: () => {
                    expect.fail("onSuccess should not be called");
                }
            });
        });
    });

    it('onError called when number is not numeric', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), "foo", {
                onError: (desc: any) => {
                    expect(desc).toBe("Number must be numeric");
                    resolve();
                },
                onSuccess: () => {
                    expect.fail("onSuccess should not be called");
                }
            });
        });
    });

    it('onSuccess called for valid number', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), "5449000096241", {
                onSuccess: (number: any) => {
                    expect(number).toBe("5449000096241");
                    resolve();
                },
                onError: () => {
                    expect.fail("onError should not be called");
                }
            });
        });
    });

    it('calculates checksum correctly (onSuccess called with appended digit)', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), "544900009624", {
                onSuccess: (number: any) => {
                    expect(number).toBe("5449000096241");
                    resolve();
                },
                onError: () => {
                    expect.fail("onError should not be called");
                }
            });
        });
    });

    it('validates correct checksum', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), "4012345123456", {
                onValid: () => {
                    resolve();
                },
                onInvalid: () => {
                    expect.fail("Should be valid");
                }
            });
        });
    });

    it('detects invalid checksum', () => {
        return new Promise<void>((resolve) => {
            new EAN13(createCanvas(), "5901234123450", {
                onValid: () => {
                    expect.fail("Should be invalid");
                },
                onInvalid: () => {
                    resolve();
                }
            });
        });
    });

    describe('encoding', () => {
        const numbers = [
            "0012345123450",
            "5060204123733",
            "3401312345624",
            "1234567890128",
            "9421023610112",
            "3800065711135",
            "5060204120848",
            "9310779300005",
            "5901234123457"
        ];

        numbers.forEach((number) => {
            it(`validates and accepts ${number}`, () => {
                return new Promise<void>((resolve) => {
                    new EAN13(createCanvas(), number, {
                        onSuccess: (res: any) => {
                            expect(res).toBe(number);
                            resolve();
                        },
                        onError: () => {
                            expect.fail(`Failed to process ${number}`);
                        }
                    });
                });
            });
        });
    });
});
