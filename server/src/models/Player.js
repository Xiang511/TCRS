const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true },
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
            trophies: { type: Number, required: true },
            bestTrophies: { type: Number, required: true }
        },
        previousSeason: {
            id: { type: String, required: true },
            trophies: { type: Number, required: true },
            bestTrophies: { type: Number, required: true }
        },
        bestSeason: {
            id: { type: String, required: true },
            rank: { type: Number },
            trophies: { type: Number, required: true }
        }
    },
    starPoints: { type: Number, required: true },
    expPoints: { type: Number, required: true },
    lastPathOfLegendSeasonResult: {
        leagueNumber: { type: Number, required: true },
        trophies: { type: Number, required: true },
        rank: { type: Number }
    },
    bestPathOfLegendSeasonResult: {
        leagueNumber: { type: Number, required: true },
        trophies: { type: Number, required: true },
        rank: { type: Number }
    },
    totalExpPoints: { type: Number, required: true },
    time: { type: String, required: true },
    progress: {
        type: Map,
        of: {
            arena: {
                id: { type: Number, required: true },
                name: { type: String, required: true }
            },
            trophies: { type: Number, required: true },
            bestTrophies: { type: Number, required: true }
        },
        required: true
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
        }
    }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;