package com.bookingplatform.ingestion.config;

import com.bookingplatform.ingestion.model.Category;
import com.bookingplatform.ingestion.model.Product;
import com.bookingplatform.ingestion.service.CategoryService;
import com.bookingplatform.ingestion.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryService categoryService;
    private final ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedMovies();
        seedRestaurants();
        seedWorkspaces();
    }

    // ─────────────────────────────────────────────
    //  CATEGORIES
    // ─────────────────────────────────────────────
    private void seedCategories() {
        // Always re-seed categories so new fields (filterKey, filterLabel, gradient, displayOrder) are picked up
        categoryService.getAllCategories().forEach(c -> categoryService.deleteCategory(c.getId()));

        categoryService.saveCategory(new Category(
            "MOVIE", "Movies", "🎬",
            "Book tickets for the latest blockbusters",
            "genre", "Genre",
            "linear-gradient(135deg,#e31837 0%,#7b0a1e 100%)",
            1
        ));
        categoryService.saveCategory(new Category(
            "RESTAURANT", "Restaurants", "🍽️",
            "Reserve a table at your favourite spot",
            "cuisineType", "Cuisine",
            "linear-gradient(135deg,#f97316 0%,#7c2d12 100%)",
            2
        ));
        categoryService.saveCategory(new Category(
            "WORKSPACE", "Workspaces", "💻",
            "Quiet desks and meeting rooms",
            "type", "Space Type",
            "linear-gradient(135deg,#6366f1 0%,#1e1b4b 100%)",
            3
        ));
        System.out.println("[IngestionService] Categories seeded with filterKey/filterLabel/gradient.");
    }

    // ─────────────────────────────────────────────
    //  MOVIES
    // ─────────────────────────────────────────────
    private void seedMovies() {
        if (!productService.getByCategory("MOVIE").isEmpty()) {
            System.out.println("[IngestionService] Movies already seeded, skipping.");
            return;
        }

        productService.save("MOVIE", new Product(null, "MOVIE",
            "Inception",
            "A thief who steals corporate secrets through the use of dream-sharing technology.",
            "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            12.99,
            Map.of(
                "genre",    List.of("Action", "Sci-Fi", "Thriller"),
                "director", "Christopher Nolan",
                "cast",     List.of("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"),
                "language", "English",
                "duration", 148,
                "rating",   8.8,
                "showtimes", List.of(
                    Map.of("date","2026-03-10","time","10:00","screen","Screen 1","seats",120,"price",12.99),
                    Map.of("date","2026-03-10","time","14:00","screen","Screen 2","seats",80, "price",14.99),
                    Map.of("date","2026-03-10","time","19:00","screen","IMAX",    "seats",200,"price",18.99)
                )
            )
        ));

        productService.save("MOVIE", new Product(null, "MOVIE",
            "The Matrix",
            "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
            "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            11.99,
            Map.of(
                "genre",    List.of("Action", "Sci-Fi"),
                "director", "The Wachowskis",
                "cast",     List.of("Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"),
                "language", "English",
                "duration", 136,
                "rating",   8.7,
                "showtimes", List.of(
                    Map.of("date","2026-03-11","time","11:00","screen","Screen 3","seats",100,"price",11.99),
                    Map.of("date","2026-03-11","time","16:30","screen","Screen 1","seats",120,"price",13.99)
                )
            )
        ));

        productService.save("MOVIE", new Product(null, "MOVIE",
            "Interstellar",
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            13.99,
            Map.of(
                "genre",    List.of("Adventure", "Drama", "Sci-Fi"),
                "director", "Christopher Nolan",
                "cast",     List.of("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"),
                "language", "English",
                "duration", 169,
                "rating",   8.6,
                "showtimes", List.of(
                    Map.of("date","2026-03-12","time","09:30","screen","IMAX",    "seats",200,"price",19.99),
                    Map.of("date","2026-03-12","time","13:00","screen","Screen 2","seats",80, "price",13.99),
                    Map.of("date","2026-03-12","time","18:30","screen","Screen 4","seats",60, "price",13.99)
                )
            )
        ));

        System.out.println("[IngestionService] Movies seeded.");
    }

    // ─────────────────────────────────────────────
    //  RESTAURANTS
    // ─────────────────────────────────────────────
    private void seedRestaurants() {
        if (!productService.getByCategory("RESTAURANT").isEmpty()) {
            System.out.println("[IngestionService] Restaurants already seeded, skipping.");
            return;
        }

        productService.save("RESTAURANT", new Product(null, "RESTAURANT",
            "Pasta Palace",
            "Authentic Italian dining with wood-fired pizzas and house-made pasta.",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
            0.0,
            Map.of(
                "cuisineType",  "Italian",
                "rating",       4.6,
                "address",      "12 Milano Street, Bangalore",
                "phone",        "+91-80-1234-5678",
                "openingHours", "11:00 AM - 11:00 PM",
                "menuItems", List.of(
                    Map.of("name","Margherita Pizza",    "description","Classic tomato & mozzarella",               "price",399, "category","Main",    "isVeg",true),
                    Map.of("name","Penne Arrabbiata",    "description","Spicy tomato sauce with penne",              "price",329, "category","Main",    "isVeg",true),
                    Map.of("name","Bruschetta",          "description","Grilled bread with tomato & basil",          "price",199, "category","Starter", "isVeg",true),
                    Map.of("name","Chicken Alfredo",     "description","Creamy white sauce with grilled chicken",    "price",499, "category","Main",    "isVeg",false),
                    Map.of("name","Tiramisu",            "description","Classic Italian coffee-flavoured dessert",   "price",249, "category","Dessert", "isVeg",true),
                    Map.of("name","Sparkling Water",     "description","Still or Sparkling 500ml",                  "price", 89, "category","Drink",   "isVeg",true)
                )
            )
        ));

        productService.save("RESTAURANT", new Product(null, "RESTAURANT",
            "Sushi Zen",
            "Minimalist Japanese restaurant with fresh sushi, ramen and sake.",
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500",
            0.0,
            Map.of(
                "cuisineType",  "Japanese",
                "rating",       4.8,
                "address",      "7 Zen Garden, Indiranagar, Bangalore",
                "phone",        "+91-80-9876-5432",
                "openingHours", "12:00 PM - 10:30 PM",
                "menuItems", List.of(
                    Map.of("name","Salmon Nigiri (6 pc)",  "description","Fresh Atlantic salmon slices on rice",      "price",599, "category","Main",    "isVeg",false),
                    Map.of("name","Dragon Roll",           "description","Prawn tempura, cucumber, avocado top",      "price",649, "category","Main",    "isVeg",false),
                    Map.of("name","Edamame",               "description","Steamed salted soy beans",                  "price",199, "category","Starter", "isVeg",true),
                    Map.of("name","Miso Ramen",            "description","Rich miso broth, chashu pork, soft egg",    "price",549, "category","Main",    "isVeg",false),
                    Map.of("name","Matcha Ice Cream",      "description","House-made green tea ice cream",            "price",249, "category","Dessert", "isVeg",true),
                    Map.of("name","Sake (180ml)",          "description","Premium Junmai Daiginjo sake",              "price",699, "category","Drink",   "isVeg",true)
                )
            )
        ));

        productService.save("RESTAURANT", new Product(null, "RESTAURANT",
            "Burger Barn",
            "Gourmet American burgers, craft beer and loaded fries in a rustic setting.",
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
            0.0,
            Map.of(
                "cuisineType",  "American",
                "rating",       4.4,
                "address",      "34 Cubbon Road, MG Road, Bangalore",
                "phone",        "+91-80-5555-0101",
                "openingHours", "11:30 AM - 12:00 AM",
                "menuItems", List.of(
                    Map.of("name","BBQ Bacon Burger",      "description","Double beef patty, bacon, BBQ sauce",       "price",449, "category","Main",    "isVeg",false),
                    Map.of("name","Veg Mushroom Burger",   "description","Portobello mushroom, swiss cheese",         "price",349, "category","Main",    "isVeg",true),
                    Map.of("name","Loaded Fries",          "description","Cheese, jalapeno, sour cream, chives",      "price",249, "category","Starter", "isVeg",true),
                    Map.of("name","Chicken Wings (6 pc)",  "description","Crispy wings in Buffalo sauce",             "price",379, "category","Starter", "isVeg",false),
                    Map.of("name","Brownie Sundae",        "description","Warm brownie, vanilla ice cream, fudge",    "price",299, "category","Dessert", "isVeg",true),
                    Map.of("name","Craft Beer (500ml)",    "description","Rotating local craft IPA / Lager",          "price",349, "category","Drink",   "isVeg",true)
                )
            )
        ));

        System.out.println("[IngestionService] Restaurants seeded.");
    }

    // ─────────────────────────────────────────────
    //  WORKSPACES
    // ─────────────────────────────────────────────
    private void seedWorkspaces() {
        if (!productService.getByCategory("WORKSPACE").isEmpty()) {
            System.out.println("[IngestionService] Workspaces already seeded, skipping.");
            return;
        }

        productService.save("WORKSPACE", new Product(null, "WORKSPACE",
            "Conference Room A",
            "Spacious 20-person board room with projector, whiteboard and video conferencing.",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
            999.0,
            Map.of(
                "type",      "CONFERENCE",
                "capacity",  20,
                "available", true,
                "amenities", List.of("4K Projector","Whiteboard","Video Conferencing","AC","High-Speed WiFi","Coffee Machine")
            )
        ));

        productService.save("WORKSPACE", new Product(null, "WORKSPACE",
            "Meeting Pod 1",
            "Private 2-person soundproofed pod — perfect for focus calls and pair work.",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500",
            299.0,
            Map.of(
                "type",      "POD",
                "capacity",  2,
                "available", true,
                "amenities", List.of("Soundproofed","Monitor","USB-C Hub","High-Speed WiFi","Natural Light")
            )
        ));

        productService.save("WORKSPACE", new Product(null, "WORKSPACE",
            "Open Desk 12",
            "Standing or seated hot-desk in a quiet shared zone with ergonomic chair.",
            "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=500",
            149.0,
            Map.of(
                "type",      "DESK",
                "capacity",  1,
                "available", true,
                "amenities", List.of("Ergonomic Chair","Height-Adjustable Desk","Locker","High-Speed WiFi","Printer Access")
            )
        ));

        System.out.println("[IngestionService] Workspaces seeded.");
    }
}
