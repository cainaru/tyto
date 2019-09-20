<?php
/**
 * @file
 * Add custom theme settings to the Tyto theme.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function tyto_form_system_theme_settings_alter(&$form, FormStateInterface &$form_state, $form_id = NULL) {
  // Work-around for a core bug affecting admin themes. See issue #943212.
  if (isset($form_id)) {
    return;
  }
  // $form['nexus_settings']['slideshow']['slide1']['slide1_url_readmore'] = [
  //   '#type' => 'textfield',
  //   '#title' => t('Slide Readmore'),
  //   '#field_prefix' => t('Read more about'),
  //   '#description' => t('This allows you to customize visually hidden information about the link.'),
  // ];

}
