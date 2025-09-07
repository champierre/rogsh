#!/usr/bin/env node

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

console.log('Simple input test. Type something and press Enter:');

rl.on('line', (input) => {
  console.log(`You typed: "${input}" (length: ${input.length})`);
  console.log('Characters:', Array.from(input).map(c => `'${c}'`).join(' '));
  console.log('Char codes:', Array.from(input).map(c => c.charCodeAt(0)).join(' '));
  
  if (input === 'exit') {
    rl.close();
    process.exit(0);
  }
  
  rl.prompt();
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});

rl.prompt();