package com.lumios.opencall

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    OpenCallScreen()
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun OpenCallScreen() {
    var gateway by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("未连接 Gateway") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("Open Call", style = MaterialTheme.typography.headlineLarge)
        Spacer(Modifier.height(8.dp))
        Text("呼叫 AI · Work · Gateway")
        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = gateway,
            onValueChange = { gateway = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Gateway 地址") },
            placeholder = { Text("ws://192.168.x.x:18789") },
            singleLine = true
        )

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = message,
            onValueChange = { message = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("呼叫内容") },
            placeholder = { Text("继续刚才的工作") },
            minLines = 3
        )

        Spacer(Modifier.height(16.dp))

        Button(
            onClick = {
                status = if (gateway.isBlank()) "请先填写 Gateway 地址" else "已准备呼叫：$message"
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("呼叫")
        }

        Spacer(Modifier.height(16.dp))
        Text(status, style = MaterialTheme.typography.bodyMedium)
    }
}
