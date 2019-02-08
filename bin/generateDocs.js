const fs = require('fs');
const parser = require('comment-parser');

const classQueryFile = fs.readFileSync('./src/classQuery.js', 'utf-8');

const docBlocks = parser(classQueryFile);

if (!fs.existsSync('./docs')) {
	console.error('No /docs folder!\n');
	process.exit(1);
}

docBlocks.forEach(docBlock => {
	let partType = 'action';
	let partName = 'undefined';
	let sections = [];

	sections.push({
		title:   'Description',
		content: docBlock.description.replace('\n', '  \n')
	});

	let arguments = [];

	docBlock.tags.forEach(tag => {
		switch (tag.tag) {
			case 'cq_part':
				partType = tag.name;

				if (!['event', 'action', 'selector'].includes(partType)) {
					console.error('Invalid value for @cq_part: ' + partType + '\n');
					process.exit(1);
				}
				break;

			case 'cq_partName':
				partName = tag.name;
				break;

			case 'cq_examples':
				sections.push({
					title:   'Examples',
					content: tag.source.replace('@cq_examples', '').trim()
				});
				break;

			case 'cq_arg':
				arguments.push({
					name:        tag.name,
					description: tag.description
				});
				break;
		}
	});


	if (arguments.length > 0) {
		let argumentsSection = {
			title:   'Arguments',
			content: `If you use external arguments, use the argument\'s name.  
If you use non-external arguments, use the order of the arguments as written here:
`
		};

		arguments.forEach(argument => {
			argumentsSection.content += `
#### ${argument.name}

${argument.description}
`;
		});

		argumentsSection.content.trim();
		sections.splice(1, 0, argumentsSection);
	}


	let output = `# ${partName}
`;
	sections.forEach(section => {
		output += `
## ${section.title}

${section.content}
`;
	});

	fs.writeFileSync('./docs/reference/' + partType + 's/' + partName + '.md', output.trim());
});