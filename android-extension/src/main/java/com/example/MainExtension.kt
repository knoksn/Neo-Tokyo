package com.example

import android.content.Context
import android.widget.Toast
import android.app.Activity
import android.view.inputmethod.InputMethodManager
import android.view.View

/**
 * Shows a short Toast message from any Context.
 * @param message The message to display in the Toast.
 */
fun Context.showShortToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}

/**
 * Shows a long Toast message from any Context.
 * @param message The message to display in the Toast.
 */
fun Context.showLongToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_LONG).show()
}

/**
 * Hides the soft keyboard from an Activity.
 */
fun Activity.hideKeyboard() {
    val view: View? = currentFocus ?: View(this)
    val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
    imm.hideSoftInputFromWindow(view?.windowToken, 0)
}

/**
 * Makes the view visible.
 */
fun View.show() {
    this.visibility = View.VISIBLE
}

/**
 * Hides the view (sets visibility to GONE).
 */
fun View.hide() {
    this.visibility = View.GONE
}
