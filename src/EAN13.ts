interface EAN13Options {
    number?: boolean;
    prefix?: boolean;
    color?: string;
    background?: string | null;
    padding?: number;
    debug?: boolean;
    onValid?: () => void;
    onInvalid?: () => void;
    onSuccess?: (number: string) => void;
    onError?: (message: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class EAN13 {
    element: HTMLCanvasElement;
    number: string;
    settings: EAN13Options;

    constructor(element: HTMLCanvasElement, number: string, options?: EAN13Options) {
        this.element = element;
        this.number = number;

        // set defaults
        this.settings = {
            // settings
            number: true,
            prefix: true,
            color: "#000",
            background: null,
            padding: 0,
            debug: false,

            // callbacks
            onValid: () => { },
            onInvalid: () => { },
            onSuccess: () => { },
            onError: () => { }
        };

        if (options) {
            for (const option in options) {
                if (Object.prototype.hasOwnProperty.call(options, option)) {
                    (this.settings as any)[option] = (options as any)[option];
                }
            }
        }

        // call draw function
        this.init();
    }

    init(): void {
        if (!this.number) {
            if (this.settings.onError) this.settings.onError.call(this, "Number cannot be null");
            return;
        }

        if (!this.isNumeric(this.number)) {
            if (this.settings.onError) this.settings.onError.call(this, "Number must be numeric");
            return;
        }

        // also disable prefix if no number should be drawn
        if (!this.settings.number) {
            this.settings.prefix = false;
        }

        if (this.number.length === 12) {
            const checkDigit = this.generateCheckDigit(this.number);
            this.number += checkDigit;
        }

        // check if length of code matches specification
        if (this.number.length === 13) {

            // check if code is valid
            if (this.validate()) {
                if (this.settings.onValid) this.settings.onValid.call(this);
            } else {
                if (this.settings.onInvalid) this.settings.onInvalid.call(this);
            }

            // call getCode method
            const code = this.getCode();

            // call draw function
            this.draw(code);

        } else {
            if (this.settings.onError) this.settings.onError.call(this, "number length is not 12 or 13");
        }
    }

    isNumeric(input: any): boolean {
        return !isNaN(parseFloat(input)) && isFinite(input);
    }

    getCode(): [number, number] {
        // EAN 13 code tables
        const tables = [
            [0xd, 0x19, 0x13, 0x3d, 0x23, 0x31, 0x2f, 0x3b, 0x37, 0xb],
            [0x27, 0x33, 0x1b, 0x21, 0x1d, 0x39, 0x5, 0x11, 0x9, 0x17],
            [0x72, 0x66, 0x6c, 0x42, 0x5c, 0x4e, 0x50, 0x44, 0x48, 0x74]
        ];

        // countries table (1 = even, 0 = odd)
        const countries = [0x0, 0xb, 0xd, 0xe, 0x13, 0x19, 0x1c, 0x15, 0x16, 0x1a];

        // init code variable for saving of lines
        let leftCode = 0;
        let rightCode = 0;

        // get the prefix
        const prefix = parseInt(this.number.substr(0, 1), 10);

        // get country encoding
        const encoding = countries[prefix];

        // remove country-prefix
        const raw_number = this.number.substr(1);

        // get chars of input number
        const parts = raw_number.split("");

        // loop through left groups with country encoding
        let i = 0;
        while (i <= 5) {
            const table = (encoding >> (5 - i)) & 0x1;

            // shift left to make place for next ( << 7 )
            leftCode *= Math.pow(2, 7);

            const digit = parseInt(parts[i], 10);

            // add bits ( code |= ... )
            leftCode += tables[table][digit];

            i++;
        }

        // loop through right groups with third table
        i = 0;
        while (i <= 5) {

            // << 7
            rightCode *= Math.pow(2, 7);

            const digit = parseInt(parts[6 + i], 10);

            rightCode += tables[2][digit];

            i++;
        }

        return [leftCode, rightCode];
    }

    clear(context: CanvasRenderingContext2D): void {
        if (this.settings.background == null) {
            context.clearRect(0, 0, this.element.width, this.element.height);
        } else {
            context.fillStyle = this.settings.background;
            context.fillRect(0, 0, this.element.width, this.element.height);
        }
    }

    draw(code: [number, number]): void {
        // layout vars
        const layout = {
            prefix_offset: 0.06,
            font_stretch: 0.073,

            // the ratio of border and middle line height to
            // height of the barcode when the number is printed
            border_line_height_number: 0.95,

            // the ratio of order and middle line height to
            // height of the barcode without number
            border_line_height: 1,

            // the ratio of normal lines to the border and
            // middle lines
            line_height: 0.9,

            font_size: 0.15,
            font_y: 1.03,
            text_offset: 2
        };

        // calculate width of barcode element
        let width: number;
        let width_no_padding: number;
        if (this.settings.prefix) {
            width_no_padding = (this.element.width - 2 * (this.settings.padding || 0));
            width = width_no_padding - (width_no_padding * layout.prefix_offset);
        } else {
            width = this.element.width - 2 * (this.settings.padding || 0);
        }

        // calculate height of barcode
        let height: number;
        let height_no_padding: number;
        let border_height: number;

        if (this.settings.number) {
            height_no_padding = this.element.height - 2 * (this.settings.padding || 0);
            border_height = layout.border_line_height_number * height_no_padding;
            height = layout.line_height * border_height;
        } else {
            height_no_padding = (this.element.height - 2 * (this.settings.padding || 0));
            border_height = layout.border_line_height * height_no_padding;
            height = border_height;
        }

        // calculate width of every element
        const item_width = width / 95;

        // check if canvas-element is available
        if (!this.element.getContext) {
            //call error callback
            if (this.settings.onError) this.settings.onError.call(this, "canvas context is null");
            return;
        }

        // get draw context
        const context = this.element.getContext("2d");
        if (!context) {
            if (this.settings.onError) this.settings.onError.call(this, "canvas context is null");
            return;
        }

        // clear canvas from previous drawing
        this.clear(context);

        // set fill color
        context.fillStyle = this.settings.color!;

        // calculate starting offset for code in x-axis
        let left: number;
        if (this.settings.number && this.settings.prefix) {
            left = this.element.width * layout.prefix_offset + (this.settings.padding || 0);
        } else {
            left = (this.settings.padding || 0);
        }

        // add left border
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);

        // move to begin of center lines
        left = left + item_width * 7 * 6;

        // loop through left lines from back to prevent 32 bit rounding
        let i = 0;
        while (i <= 42) {

            // if char is 1: draw a line
            if (code[0] % 2) {
                context.fillRect(left, (this.settings.padding || 0), item_width, height);
            }

            // alter offset
            left = left - item_width;

            // shift right
            code[0] = Math.floor(code[0] / 2);

            i++;
        }

        // move to center
        left = left + (item_width * (7 * 6)) + 3 * item_width;

        // add center
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);

        left = left + item_width * 7 * 6 + item_width;

        // loop through right lines
        // const mask = 0x20000000000; // 1000000

        while (code[1] > 0) {

            // if char is 1: draw a line
            if (code[1] % 2) {
                context.fillRect(left, (this.settings.padding || 0), item_width, height);
            }

            // alter offset
            left = left - item_width;

            code[1] = Math.floor(code[1] / 2);
        }

        // add right border
        left = left + item_width * 7 * 6 + item_width;
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, (this.settings.padding || 0), item_width, border_height);

        // add number representation if settings.number == true
        if (this.settings.number) {

            // set font style
            context.font = layout.font_size * height + "px monospace";

            // get prefix
            const prefix = this.number.substr(0, 1);

            // print prefix
            if (this.settings.prefix) {
                const x = (this.settings.padding || 0);
                const y = border_height * layout.font_y + (this.settings.padding || 0);
                context.fillText(prefix, x, y);
            }

            // calculate x offset (where text starts)
            let prefix_offset: number;
            if (this.settings.prefix) {
                prefix_offset = layout.prefix_offset * this.element.width;
            } else {
                prefix_offset = 0;
            }

            const border_offset = 6 * item_width; // line,space,line,space at the beginning
            let offset = (this.settings.padding || 0) + prefix_offset + border_offset;

            // loop though left chars
            const chars = this.number.substr(1, 6).split("");
            for (const value of chars) {
                // print text
                const x = offset;
                const y = border_height * layout.font_y + (this.settings.padding || 0);
                context.fillText(value, x, y);

                // alter offset
                offset += layout.font_stretch * width;
            }

            // calculate offset for right numbers
            const item_offset = 4 * item_width;
            offset = offset + item_offset;

            // loop though right chars
            const rightChars = this.number.substr(7).split("");
            for (const value of rightChars) {

                // print text
                const x = offset;
                const y = border_height * layout.font_y + (this.settings.padding || 0);
                context.fillText(value, x, y);

                // alter offset
                offset += layout.font_stretch * width;
            }
        }

        // check if debug pattern should be printed (use with prefix=false)
        if (this.settings.debug) {

            // const divider = [3, 3 + 1 * 7, 3 + 2 * 7, 3 + 3 * 7, 3 + 4 * 7, 3 + 5 * 7, 3 + 6 * 7]; // in item widths

            for (let x = 0; x <= width; x += item_width) {
                context.beginPath();
                context.rect(x, 0, 1, border_height);
                context.fillStyle = 'red';
                context.fill();
            }

            // divider (in item widths)
            const lines = [
                3, 3 + 1 * 7, 3 + 2 * 7,
                3 + 3 * 7, 3 + 4 * 7, 3 + 5 * 7,
                3 + 6 * 7, 3 + 6 * 7 + 5, 3 + 6 * 7 + 5 + 1 * 7,
                3 + 6 * 7 + 5 + 2 * 7, 3 + 6 * 7 + 5 + 3 * 7, 3 + 6 * 7 + 5 + 4 * 7,
                3 + 6 * 7 + 5 + 5 * 7, 3 + 6 * 7 + 5 + 6 * 7
            ];

            for (const line of lines) {
                context.beginPath();
                context.rect(line * item_width, 0, 1, this.element.height);
                context.fillStyle = 'red';
                context.fill();
            }
        }

        if (this.settings.onSuccess) this.settings.onSuccess.call(this, this.number);
    }

    generateCheckDigit(number: string): number {
        let counter = 0;
        const chars = number.split("");

        // loop through chars
        chars.forEach((value, key) => {

            // check if odd
            if (key % 2 === 0) {
                // count up counter
                counter += parseInt(value, 10);
            } else {
                // count up counter
                counter += 3 * parseInt(value, 10);
            }
        });

        return (10 - (counter % 10)) % 10;
    }

    validate(): boolean {
        return parseInt(this.number.slice(-1), 10) === this.generateCheckDigit(this.number.slice(0, -1));
    }

    toBin(number: number): string {
        const str = number.toString(2);
        return '000000000'.substr(str.length) + str;
    }
}
