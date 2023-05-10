import fs from 'fs';
import yaml from 'js-yaml';
import spec, { schemaFileName } from './spec';

function generate() {
  fs.writeFileSync(schemaFileName, yaml.dump(spec), 'utf8');
}

generate();
