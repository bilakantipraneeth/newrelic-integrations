import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.util.*;

public class Main {
    private static Map<String, String> db = new HashMap<>();

    public static void main(String[] args) throws Exception {
        // Create an HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Define the API context
        server.createContext("/api", (exchange) -> {
            String method = exchange.getRequestMethod();
            String response = "Action successful";

            try {
                if (method.equals("GET")) {
                    response = "Current Data: " + db.toString();
                } else if (method.equals("POST")) {
                    String id = UUID.randomUUID().toString();
                    db.put(id, "User created at " + new Date());
                    response = "User Added with ID: " + id;
                } else if (method.equals("DELETE")) {
                    db.clear();
                    response = "All Users Deleted";
                }

                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            } catch (Exception e) {
                e.printStackTrace();
                String error = "Internal Server Error";
                exchange.sendResponseHeaders(500, error.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(error.getBytes());
                }
            }
            System.out.println("Handled " + method + " request at " + new Date());
        });

        System.out.println("--- New Relic APM Test CRUD API Started on port 8080 ---");
        server.setExecutor(null); // Default executor
        server.start();
    }
}
