import i2c from 'i2c-bus';

// CONFIG CONST
const LCD_BUS_NUMBER = 1;
const LCD_ADDRESS = 0x27;
const LCD_ENABLE = 0x04;
const LCD_SELECT_COMMAND = 0x00;
const LCD_SELECT_CHAR = 0x01;

// COMMANDS
const LCD_CLEAR_DISPLAY = 0x01;
const LCD_RETURN_HOME = 0x02;
const LCD_ENTRY_MODE_SET = 0x04;
const LCD_DISPLAY_CONTROL = 0x08;
const LCD_CURSOR_SHIFT = 0x10;
const LCD_FUNCTION_SET = 0x20;
const LCD_SET_C_GRAM_ADDR = 0x40;
const LCD_SET_D_DRAM_ADDR = 0x80;

// FLAGS FOR DISPLAY ENTRY MODE
const LCD_ENTRY_RIGHT = 0x00;
const LCD_ENTRY_LEFT = 0x02;
const LCD_ENTRY_SHIFT_INCREMENT = 0x01;
const LCD_ENTRY_SHIFT_DECREMENT = 0x00;

// FLAGS FOR DISPLAY ON/OFF CONTROL
const LCD_DISPLAY_ON = 0x04;
const LCD_DISPLAY_OFF = 0x00;
const LCD_CURSOR_ON = 0x02;
const LCD_CURSOR_OFF = 0x00;
const LCD_BLINK_ON = 0x01;
const LCD_BLINK_OFF = 0x00;

// FLAGS FOR DISPLAY/CURSOR SHIFT
const LCD_ROW_OFFSETS = {
  1: 0x00,
  2: 0x40,
  3: 0x14, 
  4: 0x54
  //...
}
const LCD_DISPLAY_MOVE = 0x08;
const LCD_CURSOR_MOVE = 0x00;
const LCD_MOVE_RIGHT = 0x04;
const LCD_MOVE_LEFT = 0x00;


// FLAGS FOR FUNCTION SET
const LCD_4_BIT_MODE = 0x00;
const LCD_8_BIT_MODE = 0x10;
const LCD_1_LINE = 0x00;
const LCD_2_LINE = 0x08;
const LCD_5x10_DOTS = 0x04;
const LCD_5x8_DOTS = 0x00;

// FLAGS FOR BLACKLIGHT CONTROL
const LCD_BACKLIGHT = 0x08;
const LCD_NO_BACKLIGHT = 0x00;


// INTERNAL_FLAGS
let lines = 2;
let columns = 16;
let displayBacklight = true;

/// USERS FUNCTIONS
// const backlight = async (state) => {
//   displayBacklight = state;
//   await _lcdWrite(state ? LCD_BACKLIGHT : LCD_NO_BACKLIGHT, LCD_SELECT_COMMAND);
// }

const moveCursorHome = async () => {
  await _lcdWrite(LCD_RETURN_HOME, LCD_SELECT_COMMAND);
}

const moveCursorLine = async (line) => {
  await _lcdWrite((0x80 + LCD_ROW_OFFSETS[line]), LCD_SELECT_COMMAND);
}

const clearDisplay = async (backlight = true) => {
  displayBacklight = backlight;
  for (let i = 1; i <= lines; i++) {
    await clearLine(i);
  }
  await moveCursorHome();
}

const clearLine = async (line = 1) => {
  await displayStringLine(' '.repeat(columns),line, false);
}

const displayStringLine = async (message, line = 1, erase = true) => {
  if (erase) await clearLine(line);
  await moveCursorLine(line);
  if (typeof message == 'string') {
    Array.from(message).forEach( async char => {
        let c = char.charCodeAt(0);
			  await _lcdWrite(c, LCD_SELECT_CHAR);
    });
	}
}

// INITIALIZATIONS + WRITERS + ERROR_HANDLER

const i2c_bus = i2c.open(LCD_BUS_NUMBER, (error) => {
  if (error) {
    console.log(`Error opening I2C bus: ${error}`)
    process.exit(1);
  }
});

const _sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const _handleLcdError = (error, bytesWritten, buffer) => {
  if (error) console.log(`Error writting to I2C bus: ${error}`);
}

const _lcdI2CWrite = (buffer) => {
  i2c_bus.i2cWrite(LCD_ADDRESS, 1, buffer, _handleLcdError);
}

const _lcdWriteFourBits = (command , mode = LCD_SELECT_COMMAND) => {
  let dataFix = command & 0xF0;
  let backlight = displayBacklight ? LCD_BACKLIGHT : LCD_NO_BACKLIGHT;
  _lcdI2CWrite(Buffer.from([(dataFix | backlight | mode)]));
  _lcdI2CWrite(Buffer.from([(dataFix | LCD_ENABLE | backlight | mode)]));
  _lcdI2CWrite(Buffer.from([(dataFix | backlight | mode)]));
}

const _lcdWrite = async (command, mode = LCD_SELECT_COMMAND) => {
  _lcdWriteFourBits(command, mode);
  _lcdWriteFourBits(command << 4, mode);
  await _sleep(1);
}

const _initI2cLcd = async () => {
  _lcdWriteFourBits(0x30, LCD_SELECT_COMMAND);
  _lcdWriteFourBits(0x30, LCD_SELECT_COMMAND);
  _lcdWriteFourBits(0x30, LCD_SELECT_COMMAND);
  _lcdWriteFourBits(0x20, LCD_SELECT_COMMAND);

  await _lcdWrite(( LCD_FUNCTION_SET | LCD_4_BIT_MODE | LCD_2_LINE | LCD_5x8_DOTS ), LCD_SELECT_COMMAND);
  await _lcdWrite(( LCD_DISPLAY_CONTROL | LCD_DISPLAY_ON | LCD_CURSOR_OFF | LCD_BLINK_OFF ), LCD_SELECT_COMMAND);
  await _lcdWrite(( LCD_ENTRY_MODE_SET | LCD_ENTRY_LEFT), LCD_SELECT_COMMAND);
  await moveCursorHome();
}

await _initI2cLcd();

export {
  moveCursorHome,
  moveCursorLine,
  clearDisplay,
  clearLine,
  displayStringLine
}