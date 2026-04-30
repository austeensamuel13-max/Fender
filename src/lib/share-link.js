function encodeBuild(selection) {
  return Buffer.from(JSON.stringify(selection), 'utf8').toString('base64url');
}

function decodeBuild(encoded) {
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
}

module.exports = {
  encodeBuild,
  decodeBuild
};
