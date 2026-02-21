function onUpdateFunction() {
	//Dump the grammer to javascript console for debugging
	let ABC = AbcEditorGetText();
	AbcEditorDumpTree(ABC);
}

function onKeyDownFunction() {

}

function CreateTestEditor(DarkMode) {
	//Set page background color for light or dark mode
	document.body.style.backgroundColor = !DarkMode ? "White" : "Black";
	
	//Set the test ABC that includes all features and colors
	let ABC = ""
	+"X: 1\n"
	+"T:Title % String field\n"
	+"M:3/4 % Not a string field\n"
	+"W:This-is a lyric_ line~\n"
	+"n:Does not exist\n"
	+"%Comment\n"
	+"%%metacomment=1\n"
	+"|:_A'3/2^b,,/=C''-|\"Am\"a>d|[1abc:|[2def|[\"last time\"\"F\"g|]\n"
	+"a(abc)[fa'c]|g{abd}!1!d|:|d~|a`b`c\\\n"
	+"abc[r: Remark]|[M:4/4]avb|(3:a/b/c/|\n"
	+"Errors should be here!";
	;

	//Creat the editor and set the test ABC
	AbcEditorCreate(document.body, DarkMode, onUpdateFunction, onKeyDownFunction);
	AbcEditorSetText(ABC);
}
