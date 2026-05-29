1. Add export feature in edit repertoires page. Ideally, this will be in the same format as chess graph. Moderately low priority. 

2. Change 'repositories' back to a normal word for the storage. This does not affect the functionality and is therefore a low priority task. 

3. Add permanent connections to Chess.com and Lichess API with analytics page + way to display and read data. Possibly able to use current system manager, or instead build new architecture. Do not want the user to keep having to input the chess.com or lichess username. Ideally, user can connect to lichess / chess.com permanently in the settings page - Fairly high priority after making analytics page.

4. Analytics Page is able to connect to user's lichess / chess.com account and display as much analytical data as we can get our hands on! Primary focus on the opening and success rates. Compare the opening moves to saved repertoires for more data. Data should all be displayed in an easy to read way, with chess.com view, lichess view and combined view. One more primary feature is the 'novelty finder' than can analyse latest game played. Automatically return the opening played based only on saved repertoires. Return the repertoire that was followed for the most number of moves. This will be how many nodes travelled on the graph before a difference is found. This move should be marked in folder containing known deviations, which can be used later for training purpose to help the user eliminate these deviations and stick to the repertoire. If the repertoire is followed to a leaf node, the next move in the latest game is saved as a single object in a novelties folder. The idea of novelties is that they can be analysed in a novelty viewer page (later). Game data should be categorised over time periods, like latest game, today, weekly, all time etc.. that can filter what data is shown. More features to be added later. Very high priority to make a start on this. 

5. Novelty analyser - Using the stockfish api (or other suitable tool), the novelty can be analysed with how good of a move it is. Potentially could use a free ai api to provide feedback on how that move impacted the game. With this information, the user can decide to add that novelty to the repertoire as a new node on a graph. All repertoires will have two views. One that is an original, and one that contains added novelties. These are seperate JSON files, but connected through shared id, or other suitable method.

6. Add visual indicator on editrep page if a rep is black or white

7. (low priority) add manual graph creation, similar to chess graph. Putting this off because I want to think of a more unique way of doing this. Otherwise, it can be done by moving peices manually. 

8. (low priority) training tools page...

9. presaved reps (just manually created data that can be shared). Potentially could turn into a community sharing platform if I decide to take this app fully online - would require an account system, passowrd reset, email confimation, RDBSM postgres etc...

10. add peice sounds!

11. finalise logo and display

12. make 'uncategorized unable to delete

13. CURRENT: basic analysis board (without stockfish, adding that later. For now, is a way to test out features with the react chessboard (v4)). Features to add: move history, stockfish move analysis, highlight legal captures, toggle on or off highlighting legal moves, flip board, board cosmetics

14. fix spelling mistake in 'EditRepertiores'

15. ensure no inline css