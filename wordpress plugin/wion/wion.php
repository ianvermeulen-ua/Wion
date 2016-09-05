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

function enqueue_fontawesome() {
   wp_enqueue_style( 'fontawesome', 'http:////netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css', '', '4.5.0', 'all' );
}

add_action('admin_init', 'enqueue_fontawesome');

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

add_action( 'manage_users_columns', 'my_modify_user_columns' );

function my_modify_user_columns( $column_headers ) {
  unset($column_headers['posts']);

  return $column_headers;
}

function confirm_payment() {
	if( !isset( $_GET['action'] ) || esc_attr( $_GET[ 'action' ] ) != 'confirm_payment' ) {
		return;
	}
    $user_id = esc_attr( $_GET['user'] );
    $nonce = esc_attr( $_REQUEST['_wpnonce'] );

    if ( ! wp_verify_nonce( $nonce, 'wion_confirm_payment' ) ) {
      die( 'Go get a life script kiddies' );
    }
	else {
		if ( !current_user_can( 'edit_user', $user_id ) )
			return false;

		$user = new WP_User( $user_id );
		$user->set_role( 'lid' );
	}
}

add_action( 'admin_action_confirm_payment', 'confirm_payment' );

function cgc_ub_action_links( $actions, $user_object ) {
	$confirm_nonce = wp_create_nonce( 'wion_confirm_payment' );
	
	if ( $user_object->roles[0] == 'nietbetaald' || $user_object->roles[0] == 'subscriber' ) {
		$actions['confirm_payment'] = "<a href='" 
		. admin_url( "users.php?&action=confirm_payment&user=$user_object->ID&_wpnonce=$confirm_nonce") 
		. "'>" 
		. __( '<i class="fa fa-credit-card"></i> Betaling goedkeuren', 'wion' ) 
		. "</a>";
	}
	return $actions;
}
add_filter('user_row_actions', 'cgc_ub_action_links', 10, 2);

?>