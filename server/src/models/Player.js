const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    tag: { type: String, required: true },
    name: { type: String, required: true },
    expLevel: { type: Number, required: true },
    wins: { type: Number, required: true },
    losses: { type: Number, required: true },
    battleCount: { type: Number, required: true },
    threeCrownWins: { type: Number, required: true },
    challengeCardsWon: { type: Number, required: true },
    challengeMaxWins: { type: Number, required: true },
    tournamentCardsWon: { type: Number, required: true },
    tournamentBattleCount: { type: Number, required: true },
    totalDonations: { type: Number, required: true },
    leagueStatistics: {
        currentSeason: {
            trophies: { type: Number },
            bestTrophies: { type: Number }
        },
        previousSeason: {
            id: { type: String },
            trophies: { type: Number },
            bestTrophies: { type: Number }
        },
        bestSeason: {
            id: { type: String },
            rank: { type: Number },
            trophies: { type: Number }
        }
    },
    starPoints: { type: Number, default: 0 },
    expPoints: { type: Number, default: 0 },
    lastPathOfLegendSeasonResult: {
        leagueNumber: { type: Number },
        trophies: { type: Number },
        rank: { type: Number }
    },
    bestPathOfLegendSeasonResult: {
        leagueNumber: { type: Number },
        trophies: { type: Number },
        rank: { type: Number }
    },
    totalExpPoints: { type: Number, default: 0 },
    time: { type: String, required: true },
    progress: {
        type: Map,
        of: {
            arena: {
                id: { type: Number },
                name: { type: String }
            },
            trophies: { type: Number },
            bestTrophies: { type: Number }
        },
        default: {}
    },
    badges: {
        Classic12Wins: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        EmoteCollection: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        BannerCollection: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        YearsPlayed: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number }
        },
        Grand12Wins: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        '2v2': {
            level: { type: Number },    
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }    
        },
        SuddenDeath: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        RampUp: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        Draft: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        Crl20Wins: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        Crl20Wins2019: {
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number }, 
            target: { type: Number }
        },
        Crl20Wins2022: {        
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        },
        Crl20Wins2023: {
            level: { type: Number },
            maxLevel: { type: Number },

            progress: { type: Number },
            target: { type: Number }
        },          

        Crl20Wins2024: {
            level: { type: Number },
            maxLevel: { type: Number }, 
            progress: { type: Number },
            target: { type: Number }
        }, 
        Crl20Wins2025: {        
            level: { type: Number },
            maxLevel: { type: Number },
            progress: { type: Number },
            target: { type: Number }
        }          
    }       
}, {
    timestamps: true // 自動添加 createdAt 和 updatedAt
});

// 建立複合索引以提升查詢效能
playerSchema.index({ tag: 1, time: -1 });
playerSchema.index({ time: -1 });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;