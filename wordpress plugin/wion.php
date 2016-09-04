<?php
/*
Plugin Name: Wion
Plugin URI:  http://diverence.be
Description: A plugin that will assist the Wion app
Version:     1.0a
Author:      Ian Vermeulen
Author URI:  http://diverence.be
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /
Text Domain: wion
*/

add_action( 'show_user_profile', 'my_show_extra_profile_fields' );
add_action( 'edit_user_profile', 'my_show_extra_profile_fields' );

function my_show_extra_profile_fields( $user ) { ?>

	<h3>Studie informatie</h3>

	<table class="form-table">
		<tr>
			<th><label for="study">Studierichting</label></th>
			<td>
				<select name="study" id="study" value="<?php echo esc_attr( get_the_author_meta( 'study', $user->ID ) ); ?>">
					<option value="0"> TEW </option>
					<option value="1"> HI </option>
					<option value="2"> HIB </option>
					<option value="3"> SEW </option>
					<option value="4"> Andere (UA stadscampus) </option>
					<option value="5"> Andere (UA buitencampus) </option>
					<option value="6"> Andere (niet-UA) </option>
          		</select><br/>
				<span class="description">De studierichting van de gebruiker</span>
			</td>
		</tr>
		<tr>
			<th><label for="year">Jaar</label></th>
			<td>
				<select name="year" id="year" value="<?php echo esc_attr( get_the_author_meta( 'year', $user->ID ) ); ?>">
					<option value="0"> 1ste bachelor </option>
					<option value="1"> 2de bachelor </option>
					<option value="2"> 3de bachelor </option>
					<option value="3"> 1ste master </option>
					<option value="4"> 2de master </option>
					<option value="5"> Andere) </option>
          		</select><br/>
				<span class="description">Het studiejaar van de gebruiker</span>
			</td>
		</tr>
	</table>
<?php }


add_action( 'personal_options_update', 'my_save_extra_profile_fields' );
add_action( 'edit_user_profile_update', 'my_save_extra_profile_fields' );

function my_save_extra_profile_fields( $user_id ) {

	if ( !current_user_can( 'edit_user', $user_id ) )
		return false;

	update_usermeta( $user_id, 'study', $_POST['study'] );
	update_usermeta( $user_id, 'year', $_POST['year'] );
}
?>