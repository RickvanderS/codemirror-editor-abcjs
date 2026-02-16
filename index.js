import {EditorView        } from "@codemirror/view"
import {AbcMusicLanguage  } from "codemirror-lang-abcjs"
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
		"&": {
			color: "red",
			backgroundColor: "white"
		},
/*		".cm-content": {
			caretColor: "#0e9"
		},
		"&.cm-focused .cm-cursor": {
			borderLeftColor: "#0e9"
		},
		"&.cm-focused .cm-selectionBackground, ::selection": {
			backgroundColor: "#074"
		},
		".cm-gutters": {
			backgroundColor: "#045",
			color: "#ddd",
			border: "none"
		}*/
	}, {dark: DarkMode})
	
	//Abc syntax highlighting style
	const AbcHighlightStyle = HighlightStyle.define([
		//Fields
		{tag: tags.attributeName , color: "DarkOrange"},
		{tag: tags.regexp        , color: "Chocolate" },
		{tag: tags.string        , color: "DarkOliveGreen" },
		{tag: tags.attributeValue, color: "red"},
		{tag: tags.unit          , color: "DarkOliveGreen" },
		{tag: tags.punctuation   , color: "DeepPink" },
		
		//Comments
		{tag: tags.lineComment, color: "LightSeaGreen"},
		{tag: tags.comment    , color: "LightSeaGreen", fontStyle: "italic"},
		{tag: tags.docComment , color: "LightSkyBlue"},
		{tag: tags.docString  , color: "LightSkyBlue", fontStyle: "italic"},
		
		//Music odd/even
		{tag: tags.character, color: "purple"},
		{tag: tags.literal  , color: "green"},
		
		//Music other
		{tag: tags.quote        , color: "CornflowerBlue"},
		{tag: tags.separator    , color: "black"},
		{tag: tags.logicOperator, color: "Blue"},
		{tag: tags.modifier     , color: "Orange"},
		{tag: tags.brace        , color: "Aqua"},
		{tag: tags.paren        , color: "Aqua"},
		{tag: tags.macroName    , color: "Orange"},
		{tag: tags.operator     , color: "RoyalBlue"},
		
		//Music special
		{tag: tags.inserted, color: "YellowGreen"},
		{tag: tags.escape  , color: "YellowGreen"},
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
