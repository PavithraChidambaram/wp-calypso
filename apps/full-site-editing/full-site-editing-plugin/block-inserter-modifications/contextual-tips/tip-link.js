/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { inIframe } from './utils';

const isEditorIFramed = inIframe();
const isSimpleSite = !! (
	window &&
	window._currentSiteType &&
	window._currentSiteType === 'simple'
);

export default function ( { section, children, subsection } ) {
	const { hostname } = window.location;
	let autofocus,
		editorSelector,
		href = '#',
		postId,
		postType,
		returnLink;

	switch ( section ) {
		case 'themes':
			href = isEditorIFramed ? `https://wordpress.com/themes/${ hostname }` : './themes.php';
			break;

		case 'plugins':
			href = isEditorIFramed
				? `https://wordpress.com/plugins/${ hostname }`
				: './plugin-install.php';
			break;

		case 'customizer':
			editorSelector = select( 'core/editor' );
			postId = editorSelector.getCurrentPostId();
			postType = editorSelector.getCurrentPostType();
			returnLink =
				isEditorIFramed && ! isSimpleSite
					? '&' +
					  encodeURIComponent(
							`return=https://wordpress.com/block-editor/${ postType }/${ hostname }/${ postId }`
					  )
					: '';
			autofocus = `autofocus[section]=${ subsection }`;

			href =
				isEditorIFramed && isSimpleSite
					? `https://wordpress.com/customize/${ hostname }?${ autofocus }`
					: `./customize.php?${ autofocus }${ returnLink }`;
			break;
	}

	return (
		<a href={ href } target="_blank" rel="noreferrer noopener">
			{ children }
		</a>
	);
}
