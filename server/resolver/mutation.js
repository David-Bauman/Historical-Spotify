const {spawn} = require('child_process');

const runCreatePlaylist = ({link}) => new Promise((resolve, reject) => {
	const pythonProgram = spawn('python3', [__dirname + '/../../scripts/create_playlist.py', [link]]);

	pythonProgram.stdout.on('data', data => {
		const string = String.fromCharCode.apply(null, data).replace(/'/g, '"').replace(/\\\\"/g, '\'');
		const result = JSON.parse(string);
		console.log(result);
		resolve(result);
	});
	pythonProgram.stderr.on('data', data => reject(String.fromCharCode.apply(null, data)));
});

module.exports = {
	addPlaylist: runCreatePlaylist,
};