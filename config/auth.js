require('dotenv').config()
const passport = require('passport');
var express = require('express');
const googleStrategy = require( 'passport-google-oauth2' ).Strategy;