package com.brivexa.farmassistant

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    if (!isTaskRoot &&
        intent.hasCategory(Intent.CATEGORY_LAUNCHER) &&
        intent.action != null &&
        intent.action == Intent.ACTION_MAIN) {
      finish()
      return
    }
    super.onCreate(savedInstanceState)
  }

  override fun getMainComponentName(): String = "Brivexa"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
