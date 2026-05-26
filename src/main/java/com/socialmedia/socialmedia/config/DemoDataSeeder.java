package com.socialmedia.socialmedia.config;

import com.socialmedia.socialmedia.auth.entity.AuthAccount;
import com.socialmedia.socialmedia.auth.repository.AuthAccountRepository;
import com.socialmedia.socialmedia.document.UserProfile;
import com.socialmedia.socialmedia.entity.Follow;
import com.socialmedia.socialmedia.entity.Post;
import com.socialmedia.socialmedia.entity.PostComment;
import com.socialmedia.socialmedia.repository.FollowRepository;
import com.socialmedia.socialmedia.repository.PostRepository;
import com.socialmedia.socialmedia.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("dev")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);
    private static final String SAMPLE_PASSWORD = "SkillPulse@123";

    @Value("${app.demo.seed:true}")
    private boolean seedDemoData;

    private final AuthAccountRepository authAccountRepository;
    private final UserProfileRepository userProfileRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            AuthAccountRepository authAccountRepository,
            UserProfileRepository userProfileRepository,
            PostRepository postRepository,
            FollowRepository followRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authAccountRepository = authAccountRepository;
        this.userProfileRepository = userProfileRepository;
        this.postRepository = postRepository;
        this.followRepository = followRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedDemoData) {
            return;
        }

        if (userProfileRepository.findByEmail("aisha.khan@skillmesh.test").isPresent()) {
            log.info("Sample users already exist — skipping seed");
            return;
        }

        log.info("Seeding SkillMesh sample users and posts...");
        List<SampleUserSeed> sampleUsers = getSampleUsers();
        String[] captions = getCaptions();
        String[] imageUrls = getImageUrls();

        List<Long> userIds = new ArrayList<>();
        for (SampleUserSeed sampleUser : sampleUsers) {
            AuthAccount auth = new AuthAccount();
            auth.setEmail(sampleUser.email());
            auth.setPassword(passwordEncoder.encode(SAMPLE_PASSWORD));
            auth = authAccountRepository.save(auth);

            UserProfile profile = new UserProfile();
            profile.setUserId(auth.getId());
            profile.setEmail(sampleUser.email());
            profile.setName(sampleUser.name());
            profile.setUsername(sampleUser.username());
            profile.setBio(sampleUser.bio());
            userProfileRepository.save(profile);
            userIds.add(auth.getId());
        }

        for (int i = 0; i < userIds.size() * 2; i++) {
            Post post = new Post();
            post.setUserId(userIds.get(i % userIds.size()));
            post.setCaption(captions[i % captions.length]);
            post.setImageUrl(imageUrls[i % imageUrls.length]);
            postRepository.save(post);
        }

        for (int i = 0; i < userIds.size(); i++) {
            Follow follow = new Follow();
            follow.setFollowerId(userIds.get(i));
            follow.setFollowingId(userIds.get((i + 1) % userIds.size()));
            followRepository.save(follow);

            Follow secondaryFollow = new Follow();
            secondaryFollow.setFollowerId(userIds.get(i));
            secondaryFollow.setFollowingId(userIds.get((i + 3) % userIds.size()));
            followRepository.save(secondaryFollow);
        }

        List<Post> posts = postRepository.findAll();
        for (int i = 0; i < posts.size(); i++) {
            Post current = posts.get(i);
            current.getLikes().add(userIds.get((i + 1) % userIds.size()));
            current.getLikes().add(userIds.get((i + 5) % userIds.size()));

            PostComment comment = new PostComment();
            Long commenterId = userIds.get((i + 2) % userIds.size());
            SampleUserSeed commenter = sampleUsers.get((i + 2) % sampleUsers.size());
            comment.setUserId(commenterId);
            comment.setAuthorName(commenter.name());
            comment.setText(i % 2 == 0
                    ? "Great update, this is super useful."
                    : "Love this perspective. Thanks for sharing.");
            current.addComment(comment);
            postRepository.save(current);
        }

        log.info("Sample seed complete. Created {} users. Login password: {}", sampleUsers.size(), SAMPLE_PASSWORD);
    }

    private String[] getCaptions() {
        return new String[]{
                "Wrapped a production launch today. Team collaboration made all the difference.",
                "Morning standup note: clear priorities reduce stress and speed up delivery.",
                "Tried a camera walk before work. Creativity feels higher all day.",
                "Built a reusable component library card. Saved 3 hours already.",
                "Started mentoring a junior dev this week. Teaching sharpens fundamentals.",
                "Quick win: cut API response time by 28% using indexed queries.",
                "Shared a design draft and got great feedback in under 10 minutes.",
                "Taking notes from every bug fix is helping us avoid repeat incidents.",
                "Reading one chapter a day on product strategy. Tiny habits add up.",
                "Polished my portfolio with recent case studies and measurable outcomes.",
                "Weekend learning goal: better storytelling for technical presentations.",
                "Experimented with batch uploads and reduced processing time significantly.",
                "If you are switching careers, consistency beats intensity every time.",
                "Celebrating small milestones keeps motivation strong in long projects.",
                "Strong docs are a feature, not an afterthought."
        };
    }

    private String[] getImageUrls() {
        return new String[]{
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80"
        };
    }

    private List<SampleUserSeed> getSampleUsers() {
        return Arrays.asList(
                new SampleUserSeed("Aisha Khan", "aishak", "aisha.khan@skillmesh.test", "Product designer building meaningful onboarding flows."),
                new SampleUserSeed("Rahul Verma", "rahulv", "rahul.verma@skillmesh.test", "Backend engineer focused on scalable APIs."),
                new SampleUserSeed("Neha Gupta", "nehag", "neha.gupta@skillmesh.test", "Marketing strategist who loves analytics and storytelling."),
                new SampleUserSeed("Arjun Malhotra", "arjunm", "arjun.malhotra@skillmesh.test", "Full-stack developer and open-source contributor."),
                new SampleUserSeed("Ishita Roy", "ishitar", "ishita.roy@skillmesh.test", "UX researcher turning insights into product decisions."),
                new SampleUserSeed("Karan Bedi", "karanb", "karan.bedi@skillmesh.test", "Cloud engineer automating developer workflows."),
                new SampleUserSeed("Megha Sethi", "meghas", "megha.sethi@skillmesh.test", "Community manager building engaged creator circles."),
                new SampleUserSeed("Devansh Jain", "devanshj", "devansh.jain@skillmesh.test", "Data analyst sharing practical dashboard tips."),
                new SampleUserSeed("Ritika Sen", "ritikas", "ritika.sen@skillmesh.test", "Frontend engineer crafting polished user experiences."),
                new SampleUserSeed("Nikhil Arora", "nikhila", "nikhil.arora@skillmesh.test", "Startup operator obsessed with execution speed."),
                new SampleUserSeed("Pooja Nair", "poojan", "pooja.nair@skillmesh.test", "HR leader helping teams scale with empathy."),
                new SampleUserSeed("Aditya Kulkarni", "adityak", "aditya.kulkarni@skillmesh.test", "Mobile developer shipping smooth Android experiences."),
                new SampleUserSeed("Sara Mathew", "saram", "sara.mathew@skillmesh.test", "Content creator simplifying tech for beginners."),
                new SampleUserSeed("Varun Chopra", "varunc", "varun.chopra@skillmesh.test", "Security engineer sharing secure coding patterns."),
                new SampleUserSeed("Tanvi Rao", "tanvir", "tanvi.rao@skillmesh.test", "Growth manager testing experiments at scale."),
                new SampleUserSeed("Mohit Sinha", "mohits", "mohit.sinha@skillmesh.test", "DevOps specialist improving delivery reliability."),
                new SampleUserSeed("Esha Menon", "esham", "esha.menon@skillmesh.test", "Brand strategist with a love for product narratives."),
                new SampleUserSeed("Yash Patil", "yashp", "yash.patil@skillmesh.test", "Software engineer documenting practical coding learnings.")
        );
    }

    private record SampleUserSeed(String name, String username, String email, String bio) {
    }
}
