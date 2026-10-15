Event_Management_System
+--- BackEnd
|    +--- src
|    |    +--- controller
|    |    |    +--- AssignEvents.controller.js
|    |    |    +--- Categry.controller.js
|    |    |    +--- Enquiry.controller.js
|    |    |    +--- Event.controller.js
|    |    |    +--- razorpay.controller.js
|    |    |    +--- updateEnquiry.controller.js
|    |    |    \--- User.controller.js
|    |    +--- dbconfig
|    |    |    \--- ConnectDb.js
|    |    +--- middleware
|    |    |    +--- Auth.middleware.js
|    |    |    \--- Multer.middleware.js
|    |    +--- models
|    |    |    +--- AdminEarning.model.js
|    |    |    +--- assignEvent.model.js
|    |    |    +--- Category.model.js
|    |    |    +--- Enquiry.model.js
|    |    |    +--- Event.model.js
|    |    |    +--- OrganizerEarning.model.js
|    |    |    +--- Payment.model.js
|    |    |    +--- updateenquiry.model.js
|    |    |    \--- User.model.js
|    |    +--- router
|    |    |    +--- assignevent.router.js
|    |    |    +--- category.router.js
|    |    |    +--- enquiry.router.js
|    |    |    +--- event.router.js
|    |    |    +--- payment.router.js
|    |    |    \--- user.router.js
|    |    +--- utils
|    |    |    +--- AccessToken
|    |    |    |    \--- AccessToken.js
|    |    |    +--- ApiError
|    |    |    |    \--- ApiError.js
|    |    |    +--- ApiResponse
|    |    |    |    \--- ApiResponse.js
|    |    |    +--- AsyncHandler
|    |    |    |    \--- AsyncHandler.js
|    |    |    +--- Cloudinery
|    |    |    |    \--- uploadCloudinery.js
|    |    |    +--- GenrateOtp
|    |    |    |    \--- genrateOtp.js
|    |    |    +--- Nodemailer
|    |    |    |    +--- enquirystatus.js
|    |    |    |    +--- Nodemailer.js
|    |    |    |    +--- sendentrycode.js
|    |    |    |    \--- sendverificationemail.js
|    |    |    \--- RefreshToken
|    |    |         \--- RefreshToken.js
|    |    \--- index.js
|    +--- uploads
|    |    +--- 1752204037643-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752204056529-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752204107683-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752204123425-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752204173764-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752206332625-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752206495157-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752206603169-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1752260324625-d-39 (2).png
|    |    +--- 1752260325075-d-39 (2).png
|    |    +--- 1752260380125-1478SE.png
|    |    +--- 1752260530260-d-39 (2).png
|    |    +--- 1752260681353-d-39 (2).png
|    |    +--- 1752260971293-1478SE.png
|    |    +--- 1752261076205-1478SE.png
|    |    +--- 1752261334486-Screenshot 2024-12-24 000752.png
|    |    +--- 1752261430910-Screenshot 2024-12-24 000752.png
|    |    +--- 1752261560224-Screenshot 2024-12-24 000752.png
|    |    +--- 1752261648234-1478SE.png
|    |    +--- 1752261787355-Screenshot 2024-12-24 000752.png
|    |    +--- 1752323858557-22b453e5-cacf-4150-9ff9-682964226624 - Copy.jpg
|    |    +--- 1752338926193-Screenshot (16).png
|    |    +--- 1752381881740-download (1).jpg
|    |    +--- 1753101501698-Screenshot 2024-06-08 144551.png
|    |    +--- 1753101833994-Screenshot 2024-12-18 232502.png
|    |    +--- 1753101896741-Screenshot 2024-12-18 232502.png
|    |    +--- 1753102316860-Screenshot 2024-07-07 215936.png
|    |    +--- 1753102343826-Screenshot 2024-07-07 215936.png
|    |    +--- 1753102584701-Screenshot_20230228_112149.png
|    |    +--- 1753115814624-Springbgimage.jpg
|    |    +--- 1753116103024-Springbgimage.jpg
|    |    +--- 1753116164550-Springbgimage.jpg
|    |    +--- 1753116249423-Springbgimage.jpg
|    |    +--- 1753116645314-Springbgimage.jpg
|    |    +--- 1753117313913-junaidImage.jpg
|    |    +--- 1753155888204-ac1.webp
|    |    +--- 1753157661225-OIP (1).jpg
|    |    +--- 1754021247538-75500571-a51f-4ba7-b6b4-d70dd31e14d9.jpg
|    |    +--- 1754060491169-fashner1.webp
|    |    +--- 1754060567831-junaidImage.jpg
|    |    +--- 1754060658355-junaidImage.jpg
|    |    +--- 1754290425139-samar ali.jpg
|    |    +--- 1754458724946-8dd6e2af-dceb-40fe-a372-6c2623ce8291.jpeg
|    |    +--- 1754497904796-birthday.jpeg
|    |    +--- 1754498992237-festiwals.jpeg
|    |    +--- 1754543598626-birthday.jpeg
|    |    +--- 1754546183315-weeding2.jpeg
|    |    +--- 1754546243745-weeding.jpeg
|    |    +--- 1754546249047-weeding.jpeg
|    |    +--- 1754546298940-weeding.jpeg
|    |    +--- 1754577586069-birthdayparty.jpeg
|    |    +--- 1754577667569-festiwals.jpeg
|    |    +--- 1754577771446-sports event.avif
|    |    +--- 1754578015835-Exibition Image2.avif
|    |    +--- 1754579780060-college images.jpg
|    |    +--- 1754667598734-fitness.webp
|    |    +--- 1754667673654-technology.jpeg
|    |    +--- 1754734606649-weeding2.jpeg
|    |    +--- 1754825807200-college images.jpg
|    |    +--- 1754826137832-technology.jpeg
|    |    +--- 1754826197568-college images.jpg
|    |    +--- 1754878634449-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1754878860861-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754892974305-WebXlernerlogo.png
|    |    +--- 1754893809973-WebXlernerlogo.png
|    |    +--- 1754893892055-WebXlernerlogo.png
|    |    +--- 1754894064979-WebXlernerlogo.png
|    |    +--- 1754909463009-WebXLearner.png
|    |    +--- 1754909744774-Gemini_Generated_Image_ol1p1eol1p1eol1p.png
|    |    +--- 1754910387659-WebXLearner.png
|    |    +--- 1754924413180-74257486-339d-44c3-9139-cd3569e5c66d.jpg
|    |    +--- 1754925896712-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754926516988-bc105029-14cc-4193-b943-6285278b6857.jpg
|    |    +--- 1754927367992-535de3db-ea4d-4191-8ff9-1530a4a9da0e.jpg
|    |    +--- 1754927578618-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754927951467-WebXLearner.png
|    |    +--- 1754928635464-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754928845507-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754929070021-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754929564911-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754929813599-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754929896298-6c61f8e9-e3ac-48fd-b04a-a9157b88228b.jpg
|    |    +--- 1754930158205-4ff4c8d3-fc58-4b4a-a716-71c4e9b1f46a - Copy.jpg
|    |    +--- 1754967228322-bc105029-14cc-4193-b943-6285278b6857.jpg
|    |    +--- 1754967892573-a100cb25-e0e2-42a0-87d9-525ea0dec8b9.jpg
|    |    +--- 1754969027734-Weeding3.avif
|    |    +--- 1754969581869-corporate.jpg
|    |    +--- 1754983721340-samar ali.jpg
|    |    +--- 1755052337486-corporate.jpg
|    |    +--- 1755063624667-trading.avif
|    |    +--- 1772860000614-brownee-2.jpg
|    |    +--- 1772900726804-Screenshot (1).png
|    |    +--- 1772901976342-Screenshot (11).png
|    |    +--- 1772901985887-Screenshot (11).png
|    |    +--- 1772902040862-Screenshot (11).png
|    |    +--- 1772948862198-Screenshot (6).png
|    |    +--- 1772948902620-Screenshot (6).png
|    |    +--- 1772949612859-Screenshot (7).png
|    |    \--- 1772952472811-Screenshot (12).png
|    +--- .gitignore
|    +--- package.json
|    \--- package-lock.json
\--- FrontEnd
     +--- app
     |    +--- about
     |    |    \--- page.tsx
     |    +--- api
     |    |    +--- auth
     |    |    |    +--- login
     |    |    |    |    \--- route.ts
     |    |    |    \--- register
     |    |    |         \--- route.ts
     |    |    \--- events
     |    |         \--- route.ts
     |    +--- contact
     |    |    \--- page.tsx
     |    +--- dashboard
     |    |    \--- page.tsx
     |    +--- events
     |    |    +--- [id]
     |    |    |    \--- page.tsx
     |    |    +--- category
     |    |    |    \--- [slug]
     |    |    |         \--- page.tsx
     |    |    +--- create
     |    |    |    \--- page.tsx
     |    |    +--- edit
     |    |    |    \--- [id]
     |    |    |         \--- page.tsx
     |    |    \--- page.tsx
     |    +--- favorites
     |    |    \--- page.tsx
     |    +--- login
     |    |    \--- page.tsx
     |    +--- organizerdashboard
     |    |    \--- page.tsx
     |    +--- outer
     |    |    \--- dashboard
     |    |         \--- page.tsx
     |    +--- profile
     |    |    \--- page.tsx
     |    +--- register
     |    |    \--- page.tsx
     |    +--- verify-enquiry
     |    |    \--- [token]
     |    |         \--- page.tsx
     |    +--- .DS_Store
     |    +--- globals.css
     |    +--- layout.tsx
     |    \--- page.tsx
     +--- components
     |    +--- Admindashboard
     |    |    +--- categoryes.tsx
     |    |    +--- earningeventwise.tsx
     |    |    +--- EnquirySection.tsx
     |    |    +--- eventmanagement.tsx
     |    |    +--- homedashboard.tsx
     |    |    +--- monthlyRevenueChartWise.tsx
     |    |    +--- paymentshistory.tsx
     |    |    +--- revenueanalytics.tsx
     |    |    \--- UserManagement.tsx
     |    +--- ApiServices
     |    |    \--- ApiServices.tsx
     |    +--- auth
     |    |    +--- LoginForm.tsx
     |    |    \--- RegisterForm.tsx
     |    +--- axiosIntance
     |    |    \--- axiosinstance.tsx
     |    +--- CategroyDialogModel
     |    |    \--- model.tsx
     |    +--- ClientOnly
     |    |    +--- Clientonly.tsx
     |    |    \--- Home.tsx
     |    +--- commonloader
     |    |    \--- CommonLoader.tsx
     |    +--- contact
     |    |    +--- ContactForm.tsx
     |    |    \--- ContactInfo.tsx
     |    +--- dashboard
     |    |    +--- AdminDashboard.tsx
     |    |    +--- AttendeeBookingsTable.tsx
     |    |    +--- AttendeeDashboard.tsx
     |    |    +--- CategoriesTable.tsx
     |    |    +--- DashboardCategories.tsx
     |    |    +--- DashboardEvents.tsx
     |    |    +--- DashboardHeader.tsx
     |    |    +--- DashboardLoading.tsx
     |    |    +--- DashboardStats.tsx
     |    |    +--- EventsTable.tsx
     |    |    +--- OrganizerDashboard.tsx
     |    |    +--- OrganizerEventsTable.tsx
     |    |    \--- UsersTable.tsx
     |    +--- events
     |    |    +--- CategoryEvents.tsx
     |    |    +--- CategoryHeader.tsx
     |    |    +--- EventCard.tsx
     |    |    +--- EventDetail.tsx
     |    |    +--- EventDetailLoading.tsx
     |    |    +--- EventForm.tsx
     |    |    +--- EventFormEdit.tsx
     |    |    +--- EventFormLoading.tsx
     |    |    +--- EventsHeader.tsx
     |    |    +--- EventsList.tsx
     |    |    \--- EventsLoading.tsx
     |    +--- favorites
     |    |    +--- FavoritesHeader.tsx
     |    |    \--- FavoritesList.tsx
     |    +--- forgetpassword
     |    |    \--- forgetPassword.tsx
     |    +--- home
     |    |    +--- CategorySection.tsx
     |    |    +--- CTASection.tsx
     |    |    +--- FeaturedEvents.tsx
     |    |    +--- FeaturedEventsPreview.tsx
     |    |    +--- HeroSection.tsx
     |    |    +--- StatsSection.tsx
     |    |    \--- TestimonialSection.tsx
     |    +--- layout
     |    |    +--- Footer.tsx
     |    |    \--- Navbar.tsx
     |    +--- LayoutShell
     |    |    \--- LayOutShell.tsx
     |    +--- models
     |    |    +--- Eventstatusmodel.tsx
     |    |    +--- EventUpdatemodel.tsx
     |    |    \--- profileupdatemodel.tsx
     |    +--- organizerdashboard
     |    |    +--- AssignEvents.tsx
     |    |    +--- Bookingdetails.tsx
     |    |    +--- categoryes.tsx
     |    |    +--- earningeventwise.tsx
     |    |    +--- eventmanagement.tsx
     |    |    +--- homedashboard.tsx
     |    |    +--- monthlyRevenueChartWise.tsx
     |    |    +--- paymentshistory.tsx
     |    |    +--- Profile.tsx
     |    |    \--- revenueanalytics.tsx
     |    +--- Otp
     |    |    \--- Otp.tsx
     |    +--- paymentsModel
     |    |    +--- adminPaymentModel.tsx
     |    |    \--- paymentmodel.tsx
     |    +--- Profile
     |    |    \--- StarCard.tsx
     |    +--- provider
     |    |    \--- storeprovider.tsx
     |    +--- ReduxSlices
     |    |    +--- CategorySlice.tsx
     |    |    +--- CreateEventSlice.tsx
     |    |    \--- UserSlice.tsx
     |    +--- ui
     |    |    +--- accordion.tsx
     |    |    +--- alert.tsx
     |    |    +--- alert-dialog.tsx
     |    |    +--- aspect-ratio.tsx
     |    |    +--- avatar.tsx
     |    |    +--- badge.tsx
     |    |    +--- breadcrumb.tsx
     |    |    +--- button.tsx
     |    |    +--- calendar.tsx
     |    |    +--- card.tsx
     |    |    +--- carousel.tsx
     |    |    +--- chart.tsx
     |    |    +--- checkbox.tsx
     |    |    +--- collapsible.tsx
     |    |    +--- command.tsx
     |    |    +--- context-menu.tsx
     |    |    +--- dialog.tsx
     |    |    +--- drawer.tsx
     |    |    +--- dropdown-menu.tsx
     |    |    +--- form.tsx
     |    |    +--- hover-card.tsx
     |    |    +--- input.tsx
     |    |    +--- input-otp.tsx
     |    |    +--- label.tsx
     |    |    +--- menubar.tsx
     |    |    +--- navigation-menu.tsx
     |    |    +--- pagination.tsx
     |    |    +--- popover.tsx
     |    |    +--- progress.tsx
     |    |    +--- radio-group.tsx
     |    |    +--- resizable.tsx
     |    |    +--- scroll-area.tsx
     |    |    +--- select.tsx
     |    |    +--- separator.tsx
     |    |    +--- sheet.tsx
     |    |    +--- sidebar.tsx
     |    |    +--- skeleton.tsx
     |    |    +--- slider.tsx
     |    |    +--- sonner.tsx
     |    |    +--- switch.tsx
     |    |    +--- table.tsx
     |    |    +--- tabs.tsx
     |    |    +--- textarea.tsx
     |    |    +--- toast.tsx
     |    |    +--- toaster.tsx
     |    |    +--- toggle.tsx
     |    |    +--- toggle-group.tsx
     |    |    +--- tooltip.tsx
     |    |    +--- use-mobile.tsx
     |    |    \--- use-toast.ts
     |    +--- .DS_Store
     |    \--- theme-provider.tsx
     +--- hooks
     |    +--- use-mobile.tsx
     |    \--- use-toast.ts
     +--- lib
     |    +--- auth
     |    |    +--- auth-provider.tsx
     |    |    \--- auth-utils.ts
     |    +--- api.ts
     |    +--- data.ts
     |    +--- store.tsx
     |    +--- types.ts
     |    \--- utils.ts
     +--- public
     |    +--- images
     |    |    \--- alumni.jpg
     |    +--- placeholder.jpg
     |    +--- placeholder.svg
     |    +--- placeholder-logo.png
     |    +--- placeholder-logo.svg
     |    \--- placeholder-user.jpg
     +--- styles
     |    \--- globals.css
     +--- .DS_Store
     +--- .gitignore
     +--- components.json
     +--- middleware.ts
     +--- next.config.mjs
     +--- next-env.d.ts
     +--- package.json
     +--- package-lock.json
     +--- pnpm-lock.yaml
     +--- postcss.config.mjs
     +--- tailwind.config.ts
     \--- tsconfig.json