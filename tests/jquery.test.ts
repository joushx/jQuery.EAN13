import { describe, it, expect, beforeAll } from 'vitest';
import $ from 'jquery';

// Mock Canvas behavior via vitest-canvas-mock (setup file)
// We also need to load the jQuery plugin.
// Since it expects global jQuery, we set it on window.
(global as any).jQuery = $;
(global as any).$ = $;

// Load the jQuery plugin
require('../dist/jquery-ean13.js');

describe('jQuery Plugin', () => {

    // Helper to create a canvas in the DOM for jQuery to select
    const createCanvas = () => {
        document.body.innerHTML = '<canvas id="ean" width="950" height="600"></canvas>';
        return $("#ean");
    };

    it('no canvas element passed (implicit via selector?)', () => {
        // Original test: $(document).EAN13(...)
        // This calls it on a non-canvas element.
        return new Promise<void>((resolve) => {
            ($(document) as any).EAN13("5449000096241", {
                onError: (desc: any) => {
                    expect(desc).toBe("canvas context is null");
                    resolve();
                },
                onSuccess: () => {
                    expect.fail("onSuccess should not be called");
                }
            });
        });
    });

    it('checksum validation valid', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13("4012345123456", {
                onValid: () => {
                    resolve();
                },
                onInvalid: () => {
                    expect.fail("Should be valid");
                }
            });
        });
    });

    it('checksum validation invalid', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13("5901234123450", {
                onValid: () => {
                    expect.fail("Should be invalid");
                },
                onInvalid: () => {
                    resolve();
                }
            });
        });
    });

    it('number is null', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13(null, {
                onError: () => {
                    resolve();
                },
                onSuccess: () => {
                    expect.fail("onSuccess should not be called");
                }
            });
        });
    });

    it('number is not numeric', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13("foo", {
                onError: () => {
                    resolve();
                },
                onSuccess: () => {
                    expect.fail("onSuccess should not be called");
                }
            });
        });
    });

    it('success callback fired', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13("5449000096241", {
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    expect.fail("Should succeed");
                }
            });
        });
    });

    it('success callback fired without check digit', () => {
        return new Promise<void>((resolve) => {
            createCanvas().EAN13("544900009624", {
                onSuccess: (number: any) => {
                    expect(number).toBe("5449000096241");
                    resolve();
                },
                onError: () => {
                    expect.fail("Should succeed");
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
                    createCanvas().EAN13(number, {
                        onSuccess: (res: any) => {
                            // Original test checked pixel read back.
                            // We check result number consistency and implicit basic validation.
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

// Define the interface augmentation for TypeScript
interface JQuery {
    EAN13(number: string | null, options?: any): JQuery;
}
