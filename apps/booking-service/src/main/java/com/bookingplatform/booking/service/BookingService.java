package com.bookingplatform.booking.service;

import com.bookingplatform.booking.model.Booking;
import com.bookingplatform.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        if (booking.getStartTime() != null && booking.getEndTime() != null && 
            booking.getStartTime().isAfter(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        if (booking.getStatus() == null) {
            booking.setStatus("CONFIRMED");
        }
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public void cancelBooking(Long id) {
        bookingRepository.findById(id).ifPresent(booking -> {
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
        });
    }
}
