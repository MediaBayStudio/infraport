<?php

/*
	Template name: cases
*/

get_header();

foreach ( $GLOBALS['sections'] as $section ) {
	if ( $section['is_visible'] ) {
		$section_id = $section['sect_id'] ? ' id="' . $section['sect_id'] . '"' : '';
		require 'template-parts/' . $section['acf_fc_layout'] . '.php';
	}
}

get_footer();