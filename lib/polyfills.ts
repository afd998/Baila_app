import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import process from 'process';
import 'react-native-get-random-values';

global.Buffer = Buffer;
global.process = process; 