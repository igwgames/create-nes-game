function slugify(str) {
    return str.replace(/^[^a-z0-9\-_]/gi, '-').toLowerCase().replace(/\-{2,}/g, '-');
}
module.exports = slugify;