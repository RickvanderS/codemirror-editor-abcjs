import {EditorView        } from "@codemirror/view"
import {AbcMusicLanguage  } from "codemirror-lang-abcjs"
import {dumpTree          } from "codemirror-lang-abcjs"
import {tags              } from "@lezer/highlight"
import {HighlightStyle    } from "@codemirror/language"
import {syntaxHighlighting} from "@codemirror/language"
import {EditorSelection   } from "@codemirror/state";
import {lineNumbers       } from "@codemirror/view"

/// The global Codemirror editor
let g_AbcEditor;

/// Create the global editor object
export function AbcEditorCreate(ParentElement, DarkMode, onUpdateFunction, onKeyDownFunction) {
	//General editor theme
	let AbcTheme = EditorView.theme({
		"&": {color: "Red"} //Anything not recognized by the syntax highlighting, probably an error
	}, {dark: DarkMode})
	
	//Abc syntax highlighting style
	const AbcHighlightStyle = HighlightStyle.define([
		//Fields
		{tag: tags.attributeName , color: !DarkMode ? "Chocolate"      : "Orange"        }, //Filed name Name: X: K: etc. included [ and ] for inline fields
		{tag: tags.regexp        , color: !DarkMode ? "Blue"           : "CornflowerBlue"}, //Field value that is not a simple string: meter, key etc.
		{tag: tags.punctuation   , color: !DarkMode ? "Blue"           : "CornflowerBlue"}, //Lyrics field non syllable except bar
		{tag: tags.unit          , color: !DarkMode ? "DarkOliveGreen" : "Chartreuse"    }, //Lyrics field syllable: W: w:
		{tag: tags.string        , color: !DarkMode ? "DarkOliveGreen" : "Chartreuse"    }, //Field value that is a string to be written somewhere on the score, title, composer etc.
		{tag: tags.attributeValue, color: "Red"                                          }, //Field value of unknown field, propably an error: Y: z: etc
		
		//Comments
		{tag: tags.lineComment, color: !DarkMode ? "SeaGreen"   : "LightSeaGreen"                     }, //Normal comment
		{tag: tags.comment    , color: !DarkMode ? "SeaGreen"   : "LightSeaGreen", fontStyle: "italic"},
		{tag: tags.docComment , color: !DarkMode ? "DodgerBlue" : "Cyan"                              }, //Meta comment
		{tag: tags.docString  , color: !DarkMode ? "DodgerBlue" : "Cyan"         , fontStyle: "italic"},
		
		//Music odd/even
		{tag: tags.character, color: !DarkMode ? "Indigo"    : "Violet"}, //Odd music dot
		{tag: tags.literal  , color: !DarkMode ? "DarkGreen" : "Lime"  }, //Even music dot
		
		//Music other
		{tag: tags.quote        , color: !DarkMode ? "Blue"       : "CornflowerBlue"}, //Chord between ""
		{tag: tags.separator    , color: !DarkMode ? "Black"      : "White"         }, //Bar in music and lyrics (including the repaet): |[1
		{tag: tags.operator     , color: !DarkMode ? "Black"      : "White"         }, //Tie: -
		{tag: tags.logicOperator, color: !DarkMode ? "Chocolate"  : "Orange"        }, //Broken rythm: (2:3:4
		{tag: tags.modifier     , color: !DarkMode ? "Chocolate"  : "Orange"        }, //Docoration: ~ .
		{tag: tags.macroName    , color: !DarkMode ? "Chocolate"  : "Orange"        }, //Symbol: !1!
		{tag: tags.brace        , color: !DarkMode ? "DodgerBlue" : "Cyan"          }, //Grace note: { }
		{tag: tags.paren        , color: !DarkMode ? "DodgerBlue" : "Cyan"          }, //Slur: ( )
		
		//Music special
		{tag: tags.inserted, color: !DarkMode ? "DimGrey" : "Yellow"}, //Gap: `
		{tag: tags.escape  , color: !DarkMode ? "DimGrey" : "Yellow"}, //Continue next line \
	])
	
	//Hookup the keydown event
	const domHandlers = EditorView.domEventHandlers({
		keydown: (event, view) => {
			return onKeyDownFunction(event);
		}
	});
	
	//Create the editor with some extensions
	g_AbcEditor = new EditorView({
		parent: ParentElement,
		extensions: [
			lineNumbers(),
			AbcMusicLanguage,
			syntaxHighlighting(AbcHighlightStyle),
			AbcTheme,
			EditorView.updateListener.of(onUpdateFunction),
			EditorView.lineWrapping,
			domHandlers
		]
	})
}

/// Get the entire editor text
export function AbcEditorGetText() {
	let Text = g_AbcEditor.state.doc.toString();
	return Text;
}

/// Replace the entire editor text
export function AbcEditorSetText(Text) {
	g_AbcEditor.dispatch({changes: {
		from  : 0,
		to    : g_AbcEditor.state.doc.length,
		insert: Text
	}})
}

/// Get text selection range From / To
export function AbcEditorGetSelection() {
	let Selection = g_AbcEditor.state.selection.main;
	let From      = Selection.from;
	let To        = Selection.to;
	return {From, To};
}

/// Set text selection range From / To
export function AbcEditorSetSelection(From, To) {
	const Selection = EditorSelection.single(From, To); // from, to are numeric offsets
	g_AbcEditor.focus();
	g_AbcEditor.dispatch({
		selection: Selection
	});
}

/// Log syntax tree of the ABC in the editor to the console
export function AbcEditorDumpTree() {
	dumpTree(AbcEditorGetText());
}
