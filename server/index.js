const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')
const targetUrl = 'http://a0830433.xsph.ru'

// Load your SSL certificate and private key
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8')
const certificate = fs.readFileSync('localhost.pem', 'utf8')

// Replace with your passphrase
const passphrase = 'gaurav'
const credentials = { key: privateKey, passphrase, cert: certificate }

// Create an HTTPS server with your Express app
const httpsServer = https.createServer(credentials, app)

// Define a middleware to redirect HTTP to HTTPS
function ensureSecure(req, res, next) {
	if (req.secure) {
		return next()
	}
	res.redirect('https://' + req.hostname + req.originalUrl)
}
app.use(ensureSecure)

app.use('/', createProxyMiddleware({
	target: targetUrl,
	changeOrigin: true,
	secure: false
}))

httpsServer.listen(44305, () => {
	console.log('HTTPS server running on port 44305')
})