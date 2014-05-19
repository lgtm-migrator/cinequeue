var config = require( './config' );
var colog = require( 'colog' );
var i18n = require( 'i18n' );
var app = require( './server.js' );

i18n.configure( {
	locales: [ 'en' ],
	directory: __dirname + '/messages',
	defaultLocale: langcode,
	cookie: config.get( 'i18n-cookie' ),
	updateFiles: false
} );
app.use( i18n.init );

var langcode = [ config.get( 'language' ) ];
langcode[1] = langcode[0].split( '_' )[0];

if ( langcode[0] != langcode[1] ) {
	colog.info( i18n.__( 'Simplifying %s to %s', langcode[0], langcode[1] ) ) ;
}

colog.success( i18n.__( 'Successfully loaded i18n' ) );
