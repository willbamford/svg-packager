
var fs = require('fs'),
    request = require('request'),
    zlib = require('zlib'),
    headers = {
      'Accept-Encoding': 'gzip'
    };

fs.readFile('test.svg', 'utf8', function (err, data) {

    if (err) return console.log(err);

    var re = /((?:(?:[a-zA-Z]+):\/\/)?[a-zA-Z0-9-\.\/_\@]+(?:png|jpeg|jpg|woff))/g,
        m,
        url,
        localUrl,
        urls = [],
        localUrls = [];
 
    while ((m = re.exec(data)) != null) {
        if (m.index === re.lastIndex)
            re.lastIndex++;
        url = m[0];
        localUrl = url.replace(/[^a-z0-9-\.]/gi, '_').toLowerCase();
        localUrls.push(localUrl);
        urls.push(url);
        data = data.replace(url, localUrl);
    }

    fs.writeFile('finished.svg', data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The SVG file was saved');
        }
    });

    for (var i = 0; i < urls.length; i++) {
        var url = urls[i],
            localUrl = localUrls[i],
            dest = localUrl;
        (function (url) {
            downloadGzip(url, dest);
        } (url));
    }
});

var downloadGzip = function (url, filename) {
     request({ url: url, 'headers': headers })
        .pipe(zlib.createGunzip()) // Unzip
        .pipe(fs.createWriteStream(filename));
};