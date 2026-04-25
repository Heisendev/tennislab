import express from 'express';
import { getDatabase } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const matches = [];
        const userId = req.session?.userId;
        let query = `
            SELECT
                m.id,
                m.tournament,
                m.round,
                m.surface,
                m.format,
                m.date,
                m.duration,
                m.winner,
                m.tossWinner,
                m.isPublic,
                m.creator_id,

                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country,
                    'rank', pa.rank,
                    'seed', m.playerASeed
                ) AS playerA,

                json_object(
                    'id', pb.id,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country,
                    'rank', pb.rank,
                    'seed', m.playerBSeed
                ) AS playerB

            FROM matches m
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            `;


            if (userId) {
                query += ` WHERE m.isPublic = 1 OR (m.isPublic = 0 AND m.creator_id = ?)`;
            }

            const matchesRequest = db.prepare(query);
            //for each match, we want to get the playerA and playerB info as a JSON object
            for (const match of matchesRequest.iterate(userId)) {
                try {
                    match.playerA = JSON.parse(match.playerA);
                } catch (error) {
                    console.error(`Error parsing playerA for match ${match.id}:`, error);
                    match.playerA = null; // Set to null if parsing fails
                }
                try {
                    match.playerB = JSON.parse(match.playerB);
                } catch (error) {
                    console.error(`Error parsing playerB for match ${match.id}:`, error);
                    match.playerB = null; // Set to null if parsing fails
                }
                matches.push(match);
            }
        
            res.json(matches); 
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/', (req, res) => {
    try {
        const {tournament, surface, round, format, date, playerA, playerB, isPublic, userId} = req.body;
        if(!tournament || !playerA || !playerB|| !surface || !format || !date || !round || isPublic === undefined || !userId){
            return res.status(400).json({error: "missing required field"})
        }

        const publicBoolean = isPublic ? 1 : 0;

        const db = getDatabase();
        const stmt = db.prepare(`
           INSERT INTO matches (tournament, isPublic, creator_id, surface, round, format, playerA_id, playerB_id, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        `);
        const result = stmt.run(tournament, publicBoolean, userId, surface, round, format, playerA, playerB, date);

        res.status(201).json({id: result.lastInsertRowid, tournament, surface, round, format, playerA, playerB, date, isPublic, userId});
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const matchId = req.params.id;
        const matchRequest = db.prepare(`
            SELECT
                m.id,
                m.tournament,
                m.round,
                m.surface,
                m.format,
                m.date,
                m.duration,
                m.winner,
                m.tossWinner,

                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country,
                    'rank', pa.rank,
                    'seed', m.playerASeed
                ) AS playerA,

                json_object(
                    'id', pb.id,
                    'rank', pb.rank,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country,
                    'seed', m.playerBSeed
                ) AS playerB

            FROM matches m
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            WHERE m.id = ?
            `);
            const match = matchRequest.get(matchId);
            if (match) {
                match.playerA = JSON.parse(match.playerA);
                match.playerB = JSON.parse(match.playerB);
                res.json(match); 
            } else {
                res.status(404).json({ error: "Match not found" });
            }
    } catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;