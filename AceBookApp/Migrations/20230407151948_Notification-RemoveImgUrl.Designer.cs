﻿// <auto-generated />
using System;
using AceBookApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AceBookApp.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20230407151948_Notification-RemoveImgUrl")]
    partial class NotificationRemoveImgUrl
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("AceBookApp.Models.Account", b =>
                {
                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("CoverImagePath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DOBDate")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DOBMon")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DOBYear")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProfileImagePath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Email");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("AceBookApp.Models.AdditionAccountDetail", b =>
                {
                    b.Property<string>("Loggedemail")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("CollegeInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FamilyMemberInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PlaceInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SchoolInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SocialAccInfo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WorkInfo1")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WorkInfo2")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WorkInfo3")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Loggedemail");

                    b.ToTable("additionAccountDetails");
                });

            modelBuilder.Entity("AceBookApp.Models.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CommentId"), 1L, 1);

                    b.Property<string>("CommentedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CommentedByImagepath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CommentedByName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CommentedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("CommentedText")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PostId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CommentId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("AceBookApp.Models.Friend", b =>
                {
                    b.Property<string>("RequestID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FromRequest")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ToRequest")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RequestID");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("AceBookApp.Models.FriendRequest", b =>
                {
                    b.Property<string>("RequestID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FromRequest")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ToRequest")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RequestID");

                    b.ToTable("FriendRequests");
                });

            modelBuilder.Entity("AceBookApp.Models.Like", b =>
                {
                    b.Property<int>("LikeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("LikeId"), 1L, 1);

                    b.Property<string>("LikedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LikedByName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PostId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("LikeId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("AceBookApp.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"), 1L, 1);

                    b.Property<string>("NotiType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NotifiedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NotifiedTo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PostId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("NotificationId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("AceBookApp.Models.Post", b =>
                {
                    b.Property<string>("PostId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Caption")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Comments")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Imagepath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Likes")
                        .HasColumnType("int");

                    b.HasKey("PostId");

                    b.ToTable("Posts");
                });
#pragma warning restore 612, 618
        }
    }
}
