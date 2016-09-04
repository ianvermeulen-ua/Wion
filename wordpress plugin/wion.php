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

function my_show_extra_profile_fields( $user ) {
	$studies = array(
		'0' => 'TEW',
		'1' => 'HI',
		'2' => 'HIB',
		'3' => 'SEW',
		'4' => 'Andere (UA stadscampus)',
		'5' => 'Andere (UA buitencampus)',
		'6' => 'Andere (niet-UA)'
	);

	$years = array(
		'0' => '1ste bachelor',
		'1' => '2de bachelor',
		'2' => '3de bachelor',
		'3' => '1ste master',
		'4' => '2de master',
		'5' => 'Andere'
	);

	$userStudy = esc_attr( get_the_author_meta( 'study', $user->ID ) );
	$userYear = esc_attr( get_the_author_meta( 'year', $user->ID ) );
	 ?>

	<h3>Studie informatie</h3>

	<table class="form-table">
		<tr>
			<th><label for="study">Studierichting</label></th>
			<td>
				<select name="study" id="study" value="<?php echo $userStudy; ?>">
				<?php foreach ( $studies as $id => $studyName ) { ?>
					<option value="<?php echo $id; ?>" <?php if ( $userStudy == $id ) { echo "selected"; } ?> > <?php echo $studyName; ?> </option>
				<?php } ?>
          		</select><br/>
				<span class="description">De studierichting van de gebruiker</span>
			</td>
		</tr>
		<tr>
			<th><label for="year">Jaar</label></th>
			<td>
				<select name="year" id="year" value="<?php echo $userYear; ?>">
				<?php foreach ( $years as $id => $yearName ) { ?>
					<option value="<?php echo $id; ?>" <?php if ( $userYear == $id ) { echo "selected"; } ?> > <?php echo $yearName; ?> </option>
				<?php } ?>
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