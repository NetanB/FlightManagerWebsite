const configurations = {
    'db': 'mongodb+srv://admin:admin@cluster0.o0rnwhv.mongodb.net/FlightManagerAPI',
    'github': {
        'clientId': 'c8b675552555cfe496fd',
        'clientSecret': '8ec290738fad139247f3eedac2e8a3a6f38b12bb',
        'callbackUrl': 'https://localhost:3000/github/callback'
    },
    
    'google': {
        'clientId': '495513753204-r4bnh5kr06n0vs848jrt6hjhvep6mrc3.apps.googleusercontent.com',
        'clientSecret': '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',
        'callbackUrl': 'https://localhost:3000/auth/google/callback',
        'passReqToCallback' : 'true'
    }
    
}   

module.exports = configurations;