/* eslint-disable camelcase */
import chango from './chango';
import open_sans from './open_sans';

export default {
  chango,
  open_sans,
  Roboto: open_sans, // Default, for test purpose
} as Record<string, string>;
