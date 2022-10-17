<template>
    <div class="moreInfoContainer">
        <div>
            <div class="icons">
                <!-- twitter icon -->
                <a href="https://twitter.com/novelnetdev" target="_blank">
                    <img class="icon" src="../assets/images/twitter-min.png" alt="twitter icon">
                </a>

                <!-- email icon -->
                <a href="mailto:dev@cyrusmcc.com">
                    <img class="icon" src="../assets/images/email-min.png" alt="email icon">
                </a>
            </div>
            <div class="terms">
                <h4>Terms and Conditions</h4>
                <p>
                    Strboard.io is intended for use by users 13 and older. If you are under the age of 13 you may not
                    utilize Strboard.io's online services.
                    <br /> <br />
                    Strboard.io is intended to be used as an anonymous platform. When submitting content on
                    Strboard.io's online services, you agree to avoid using identifying information such as full names,
                    emails, phone numbers, etc. If while viewing content submitted to Strboard.io you come across data
                    containing identifying information, you can request the removal of such content by submitting a
                    report or through email.
                    <br /> <br />
                    When submitting content on Strboard.io you agree to avoid the use of content which may be deemed as
                    harassing or discriminating or malicious in nature.
                    <br /> <br />
                    Automated actions are prohibited for use on Strboard.io without explicit permission.
                </p>
            </div>
            <div class="privacy">
                <h4>Privacy Policy</h4>
                <p>
                    All information collected by Strboard.io is applicable to this policy.
                    <br /> <br />
                    Strboard.io does not collect any personally identifiable information. The only information collected
                    by Strboard.io includes content submitted and basic metrics regarding submitted content, as well as
                    user submitted report data.
                    <br /> <br />
                    Strboard.io does not utilize any third party tools for the purposes of data collection or
                    advertisements.
                    <br /> <br />
                    No user account system currently exists on Strboard.io and thus security regarding user account
                    details is not applicable to this website.
                    <br /> <br />
                    If you come across content which may contain personally identifiable information, you may report it
                    through the report system or by email. Upon being deemed as personal information, content will be
                    removed from Strboard.io.
                    <br /> <br />
                    Information submitted to Strboard.io may be processed & stored outside the country of its
                    origin. You are expected to comply with any local laws which may influence how you interact with
                    Strboard.io.
                    <br /> <br />
                    Strboard.io is not intended to be used by individuals under the age of 13 and content which is
                    suspected to be submitted by those under 13 will be removed from the platform.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* Data */

</script>

<style scoped lang="scss">
.moreInfoContainer {
    display: flex;
    flex-direction: column;
}

h4 {
    font-size: $fontSize4;
    font-family: $techna;
    margin: spacing(0.5) 0;
}

.privacy {
    margin-top: spacing(2);
}

p {
    font-size: $fontSize2;
    font-family: 'ubuntu', sans-serif;
}
</style>
