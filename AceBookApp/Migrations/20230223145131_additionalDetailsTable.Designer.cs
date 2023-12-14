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
    [Migration("20230223145131_additionalDetailsTable")]
    partial class additionalDetailsTable
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
