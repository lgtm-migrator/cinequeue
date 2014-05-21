var app = require( '..' );
var fs = require( 'fs' );
var config = require( '../config' );
var mime = require( 'mime' );

app.get( '/fs/*', function ( req, res ) {

	if ( !config.get( 'fs.allow' ) ) {
		res.render( 'forbidden', {
			msg: res.__( 'File system browsing has been disabled.' )
		} );
		return;
	}
	var slug = '/' + decodeURI( req.params[0] );
	slug = slug.substr( 0, slug.length - 1 ); // rm trailing slash
	var path = config.get( 'fs.path' ) + slug;
	slug = slug.join( '/' );

	fs.stat( path, function ( err, stats ) {
		if ( err ) {
			throw err;
		}

		if ( stats.isDirectory() ) {
			fs.readdir( path, function ( err, files ) {
				if ( err ) {
					throw err;
				}
				res.render( 'directorylisting', {
					path: slug,
					files: files,
					stats: stats
				} );
			} );
		} else if ( !stats.isFile() ) {
			res.send( 404 );
			res.render( 'notfound' );
		} else {
			// is a file
			var url = '';
			if ( config.get( 'fs.allow' ) ) {
				url = req.connection.encrypted ? 'https://' : 'http://';
				url += req.headers.host + '/raw';
			} else {
				url = config.get( 'fs.url' );
			}
			res.render( 'filelisting', {
				path: slug,
				stats: stats,
				mime: mime.lookup( path ),
				url: url + slug
			} );
		}
	} );
} );

app.get( '/raw/*', function ( req, res ) {
	if ( !config.get( 'fs.allow' ) ) {
		res.render( 'forbidden', {
			msg: res.__( 'File system browsing has been disabled.' )
		} );
		return;
	}
	if ( !config.get( 'fs.serve' ) ) {
		res.render( 'forbidden', {
			msg: res.__( 'Direct file system download has been disabled.' )
		} );
		return;
	}
	var slug = '/' + decodeURI( req.params[0] );
	slug = slug.substr( 0, slug.length - 1 );
	var path = config.get( 'fs.path' ) + slug;
	res.sendfile( path );
} );
